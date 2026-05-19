#!/usr/bin/env python3
"""
CitaFlow VPS Deployment Script
Deploys CitaFlow safely alongside any existing project on the VPS.

Usage:
    python deploy.py

Requirements:
    pip install paramiko
"""

import sys
import os
import io
import time
import tarfile
import textwrap

# ── Auto-install paramiko ────────────────────────────────────────────────────
try:
    import paramiko
except ImportError:
    print("[setup] Installing paramiko...")
    os.system(f"{sys.executable} -m pip install paramiko")
    import paramiko

# ── Deployment Config ────────────────────────────────────────────────────────
HOST       = "187.77.15.115"
PORT       = 22
USER       = "root"
PASS       = "M3WK-XLgPK.qDTy"

REMOTE     = "/var/www/citaflow"
WEB_PORT   = 3000
API_PORT   = 3001

DB_NAME    = "citaflow_db"
DB_USER    = "citaflow_usr"
DB_PASS    = "Cf@Deploy2024!"

JWT_SECRET     = "citaflow_jwt_super_secret_prod_2024_x9zK"
JWT_REFRESH    = "citaflow_refresh_secret_prod_2024_y8wJ"

# Dirs/files excluded from tarball upload
EXCLUDE_DIRS  = {"node_modules", ".next", "dist", ".git", "__pycache__", ".turbo"}
EXCLUDE_FILES = {".env", ".env.local", ".env.production", "deploy.py",
                 "CitaFlow_Development_Plan.md", "CitaFlow_Plan_Desarrollo.docx"}

# Images directory — uploaded separately to avoid bloating the main tarball
IMAGES_LOCAL  = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                             "apps", "web", "public", "images")
IMAGES_REMOTE = f"{'/var/www/citaflow'}/apps/web/public/images"

# ── Helpers ──────────────────────────────────────────────────────────────────
def banner(msg):
    print(f"\n{'-'*55}")
    print(f"  {msg}")
    print(f"{'-'*55}")

def step(n, total, msg):
    print(f"\n[{n}/{total}] {msg}")

def run(ssh, cmd, timeout=300, show_tail=True):
    """
    Execute command on remote server.
    Returns (stdout_str, exit_code).
    """
    full_cmd = f"export DEBIAN_FRONTEND=noninteractive; {cmd}"
    _, stdout, stderr = ssh.exec_command(full_cmd, timeout=timeout)
    out_raw = stdout.read().decode("utf-8", errors="replace")
    err_raw = stderr.read().decode("utf-8", errors="replace")
    code    = stdout.channel.recv_exit_status()

    def safe(s):
        return s.encode("ascii", "replace").decode("ascii")

    if show_tail and out_raw.strip():
        lines = [l for l in out_raw.split("\n") if l.strip()]
        for line in lines[-12:]:
            print(f"    {safe(line)}")

    if err_raw.strip() and code != 0:
        err_lines = [l for l in err_raw.split("\n") if l.strip()]
        for line in err_lines[-6:]:
            print(f"    [stderr] {safe(line)}")

    return out_raw.strip(), code

def ok(msg):
    print(f"    [OK] {msg}")

def info(msg):
    print(f"    --> {msg}")

# ── Tarball ──────────────────────────────────────────────────────────────────
def make_tarball(local_root):
    """
    Walk local_root and create an in-memory .tar.gz
    skipping EXCLUDE_DIRS, EXCLUDE_FILES, and the images directory (uploaded separately).
    """
    buf = io.BytesIO()
    file_count = 0
    images_abs = os.path.normpath(IMAGES_LOCAL)

    with tarfile.open(fileobj=buf, mode="w:gz", compresslevel=9) as tar:
        for root, dirs, files in os.walk(local_root):
            # Skip images folder entirely
            if os.path.normpath(root) == images_abs:
                dirs[:] = []
                continue
            # Prune excluded directories in-place
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

            for fname in files:
                if fname in EXCLUDE_FILES or fname.endswith(".pyc"):
                    continue
                fpath   = os.path.join(root, fname)
                relpath = os.path.relpath(fpath, local_root).replace("\\", "/")
                arcname = f"citaflow/{relpath}"
                tar.add(fpath, arcname=arcname)
                file_count += 1

    buf.seek(0)
    size_mb = buf.getbuffer().nbytes / 1024 / 1024
    info(f"Packed {file_count} files — {size_mb:.1f} MB (images excluded, uploaded separately)")
    return buf


def upload_images(ssh, sftp):
    """
    Upload public/images/ to the server only if files are missing.
    Skips files that already exist on the remote to speed up re-deploys.
    """
    if not os.path.isdir(IMAGES_LOCAL):
        info("No local images directory found — skipping")
        return

    run(ssh, f"mkdir -p {IMAGES_REMOTE}", show_tail=False)

    images = [f for f in os.listdir(IMAGES_LOCAL)
              if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"))]
    to_upload = images

    info(f"Uploading {len(to_upload)} image(s) (always overwrite to keep Spanish text current)...")
    for fname in to_upload:
        local_path  = os.path.join(IMAGES_LOCAL, fname)
        remote_path = f"{IMAGES_REMOTE}/{fname}"
        size_kb = os.path.getsize(local_path) / 1024
        sftp.put(local_path, remote_path)
        print(f"    [+] {fname} ({size_kb:.0f} KB)")

    ok(f"Images upload complete ({len(to_upload)} files)")

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    banner("CitaFlow VPS Deployment  --  31.220.53.87")

    LOCAL_ROOT = os.path.dirname(os.path.abspath(__file__))
    TOTAL_STEPS = 9

    # ── 1. Connect ────────────────────────────────────────────────────────────
    step(1, TOTAL_STEPS, "Connecting to VPS...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, port=PORT, username=USER, password=PASS, timeout=30)
    transport = ssh.get_transport()
    transport.set_keepalive(15)
    transport.window_size = 4 * 1024 * 1024   # 4 MB window
    transport.packetizer.REKEY_BYTES = pow(2, 40)
    transport.packetizer.REKEY_PACKETS = pow(2, 40)
    sftp = ssh.open_sftp()
    sftp.get_channel().settimeout(300)
    ok("Connected")

    # ── 2. Scan existing services ─────────────────────────────────────────────
    step(2, TOTAL_STEPS, "Scanning server environment...")

    node_v,  _  = run(ssh, "node --version 2>/dev/null || echo NOT_INSTALLED", show_tail=False)
    pm2_v,   _  = run(ssh, "pm2 --version 2>/dev/null || echo NOT_INSTALLED", show_tail=False)
    nginx_s, _  = run(ssh, "systemctl is-active nginx 2>/dev/null || echo inactive", show_tail=False)
    redis_s, _  = run(ssh, "systemctl is-active redis 2>/dev/null || echo inactive", show_tail=False)
    pg_s,    _  = run(ssh, "systemctl is-active postgresql 2>/dev/null || echo inactive", show_tail=False)
    port80,  _  = run(ssh, "ss -tlnp 2>/dev/null | grep ':80 ' || echo FREE", show_tail=False)

    port80_taken = "FREE" not in port80

    print(f"    Node.js   : {node_v}")
    print(f"    PM2       : {pm2_v}")
    print(f"    Nginx     : {nginx_s}")
    print(f"    Redis     : {redis_s}")
    print(f"    PostgreSQL: {pg_s}")
    print(f"    Port 80   : {'taken by another project' if port80_taken else 'free'}")

    # ── 3. Install system packages ────────────────────────────────────────────
    step(3, TOTAL_STEPS, "Installing system dependencies...")

    run(ssh, "apt-get update -qq", timeout=120, show_tail=False)

    # Node.js 20 LTS
    needs_node = "NOT_INSTALLED" in node_v or any(
        f"v{n}." in node_v for n in [8, 10, 12, 14, 16, 18]
    )
    if needs_node:
        info("Installing Node.js 20 LTS...")
        run(ssh, "curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >/dev/null 2>&1", timeout=120)
        run(ssh, "apt-get install -y nodejs >/dev/null 2>&1", timeout=120)
        v, _ = run(ssh, "node --version", show_tail=False)
        ok(f"Node.js {v} installed")
    else:
        ok(f"Node.js {node_v} already present")

    # PM2
    if "NOT_INSTALLED" in pm2_v:
        info("Installing PM2...")
        run(ssh, "npm install -g pm2 --quiet", timeout=60)
        ok("PM2 installed")
    else:
        ok(f"PM2 {pm2_v} already present")

    # Redis
    if "inactive" in redis_s or "not-found" in redis_s or "failed" in redis_s:
        info("Installing Redis...")
        run(ssh, "apt-get install -y redis-server >/dev/null 2>&1", timeout=120)
        run(ssh, "systemctl enable redis-server && systemctl start redis-server", timeout=30)
        ok("Redis installed and started")
    else:
        ok("Redis already running")

    # PostgreSQL 15
    if "inactive" in pg_s or "not-found" in pg_s or "failed" in pg_s:
        info("Installing PostgreSQL 15...")
        run(ssh, "apt-get install -y postgresql postgresql-contrib >/dev/null 2>&1", timeout=180)
        run(ssh, "systemctl enable postgresql && systemctl start postgresql", timeout=30)
        ok("PostgreSQL installed and started")
    else:
        ok("PostgreSQL already running")

    # Nginx (install only — don't force-start if port 80 is taken)
    nginx_installed, _ = run(ssh, "which nginx 2>/dev/null || echo NOT_FOUND", show_tail=False)
    if "NOT_FOUND" in nginx_installed:
        info("Installing Nginx...")
        run(ssh, "apt-get install -y nginx >/dev/null 2>&1", timeout=60)
        ok("Nginx installed")
    else:
        ok("Nginx already installed")

    # ── 4. Upload project ─────────────────────────────────────────────────────
    step(4, TOTAL_STEPS, "Uploading project files...")

    tarball = make_tarball(LOCAL_ROOT)
    sftp.putfo(tarball, "/tmp/citaflow.tar.gz")
    ok("Tarball uploaded to /tmp/citaflow.tar.gz")

    run(ssh, f"mkdir -p {REMOTE}")
    # Remove old directories that may have stale files from prior deploys
    run(ssh, f"rm -rf {REMOTE}/apps/api/database {REMOTE}/apps/api/dist", show_tail=False)
    run(ssh, f"tar -xzf /tmp/citaflow.tar.gz -C /var/www/ --overwrite --strip-components=0", timeout=60)
    run(ssh, "rm -f /tmp/citaflow.tar.gz")
    ok(f"Project extracted to {REMOTE}")

    info("Syncing static images...")
    upload_images(ssh, sftp)

    # ── 5. Configure PostgreSQL database ─────────────────────────────────────
    step(5, TOTAL_STEPS, "Setting up PostgreSQL database...")

    run(ssh, f"sudo -u postgres psql -c \"DO \\$\\$ BEGIN "
             f"IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '{DB_USER}') "
             f"THEN CREATE USER {DB_USER} WITH PASSWORD '{DB_PASS}'; END IF; END \\$\\$;\"",
        show_tail=False)
    run(ssh, f"sudo -u postgres psql -c "
             f"\"CREATE DATABASE {DB_NAME} OWNER {DB_USER};\" 2>/dev/null || true",
        show_tail=False)
    run(ssh, f"sudo -u postgres psql -c "
             f"\"GRANT ALL PRIVILEGES ON DATABASE {DB_NAME} TO {DB_USER};\"",
        show_tail=False)
    ok(f"Database '{DB_NAME}' ready, user '{DB_USER}' configured")

    # ── 6. Create .env files ──────────────────────────────────────────────────
    step(6, TOTAL_STEPS, "Writing environment files...")

    api_env = textwrap.dedent(f"""\
        NODE_ENV=production
        PORT={API_PORT}
        API_URL=http://{HOST}:8080/api

        DB_HOST=localhost
        DB_PORT=5432
        DB_NAME={DB_NAME}
        DB_USER={DB_USER}
        DB_PASSWORD={DB_PASS}

        JWT_SECRET={JWT_SECRET}
        JWT_EXPIRES_IN=15m
        JWT_REFRESH_SECRET={JWT_REFRESH}
        JWT_REFRESH_EXPIRES_IN=7d

        REDIS_HOST=localhost
        REDIS_PORT=6379

        WHATSAPP_API_URL=https://graph.facebook.com/v21.0
        WHATSAPP_PHONE_NUMBER_ID=REPLACE_WITH_YOUR_PHONE_NUMBER_ID
        WHATSAPP_ACCESS_TOKEN=REPLACE_WITH_YOUR_ACCESS_TOKEN
        WHATSAPP_VERIFY_TOKEN=citaflow_verify_2024

        GOOGLE_CLIENT_ID=REPLACE_WITH_GOOGLE_CLIENT_ID
        GOOGLE_CLIENT_SECRET=REPLACE_WITH_GOOGLE_CLIENT_SECRET

        RESEND_API_KEY=REPLACE_WITH_RESEND_API_KEY
        RESEND_FROM_EMAIL=onboarding@resend.dev

        ANTHROPIC_API_KEY=REPLACE_WITH_ANTHROPIC_API_KEY

        WEB_URL=http://{HOST}:8080
    """)

    web_env = textwrap.dedent(f"""\
        NEXT_PUBLIC_API_URL=http://{HOST}:8080/api
        CONTACT_WEBHOOK_URL=
    """)

    sftp.putfo(io.BytesIO(api_env.encode()), f"{REMOTE}/apps/api/.env")
    sftp.putfo(io.BytesIO(web_env.encode()), f"{REMOTE}/apps/web/.env.local")
    ok(".env created for API and web")

    # ── 7. Install deps & build ───────────────────────────────────────────────
    step(7, TOTAL_STEPS, "Installing npm dependencies and building...")

    info("npm install (root workspace)...")
    out, code = run(ssh, f"cd {REMOTE} && npm install --prefer-offline 2>&1 | tail -5", timeout=360)
    if code != 0:
        print("    [warn] npm install returned non-zero, continuing...")

    info("Building NestJS API...")
    # Use tsc directly — avoids nest-cli incremental cache issues on fresh servers
    run(ssh, f"rm -f {REMOTE}/apps/api/tsconfig.tsbuildinfo", show_tail=False)
    out, code = run(
        ssh,
        f"cd {REMOTE}/apps/api && npx tsc 2>&1 | tail -15",
        timeout=180
    )
    main_exists, _ = run(ssh, f"ls {REMOTE}/apps/api/dist/main.js 2>/dev/null && echo YES || echo NO", show_tail=False)
    if "YES" in main_exists:
        ok("API build complete (dist/main.js confirmed)")
    else:
        print("    [WARN] dist/main.js not found after build — check TypeScript errors")

    info("Building Next.js frontend...")
    out, code = run(
        ssh,
        f"cd {REMOTE} && npm run build --workspace=@citaflow/web 2>&1 | tee /tmp/citaflow_build.log; echo \"BUILD_EXIT:${{PIPESTATUS[0]}}\"",
        timeout=360
    )
    build_ok = "BUILD_EXIT:0" in out
    if not build_ok:
        # Show full error log
        err_log, _ = run(ssh, "grep -A5 'Error\\|error\\|failed' /tmp/citaflow_build.log | head -40", show_tail=True)
        print("    [WARN] Web build FAILED — see above")
    else:
        ok("Web build complete (.next/)")

    info("Running database migrations...")
    run(
        ssh,
        f"cd {REMOTE}/apps/api && "
        f"set -o allexport && source .env && set +o allexport && "
        f"npm run migration:run 2>&1 | tail -10",
        timeout=120
    )
    ok("Migrations complete")

    # ── 8. PM2 startup ────────────────────────────────────────────────────────
    step(8, TOTAL_STEPS, "Starting services with PM2...")

    ecosystem = textwrap.dedent(f"""\
        module.exports = {{
          apps: [
            {{
              name: 'citaflow-api',
              cwd: '{REMOTE}/apps/api',
              script: 'dist/main.js',
              instances: 1,
              exec_mode: 'fork',
              autorestart: true,
              max_memory_restart: '512M',
              env: {{
                NODE_ENV: 'production',
                PORT: '{API_PORT}',
              }},
            }},
            {{
              name: 'citaflow-web',
              cwd: '{REMOTE}/apps/web',
              script: 'node_modules/.bin/next',
              args: 'start -p {WEB_PORT}',
              instances: 1,
              exec_mode: 'fork',
              autorestart: true,
              max_memory_restart: '512M',
              env: {{
                NODE_ENV: 'production',
                PORT: '{WEB_PORT}',
              }},
            }},
          ],
        }};
    """)

    sftp.putfo(io.BytesIO(ecosystem.encode()), f"{REMOTE}/ecosystem.config.js")

    run(ssh, "pm2 delete citaflow-api citaflow-web 2>/dev/null || true", show_tail=False)
    run(ssh, f"cd {REMOTE} && pm2 start ecosystem.config.js", timeout=60)
    run(ssh, "pm2 save", timeout=30, show_tail=False)
    run(ssh, "pm2 startup systemd -u root --hp /root 2>/dev/null | tail -1 | bash 2>/dev/null || true",
        timeout=30, show_tail=False)

    time.sleep(3)
    status, _ = run(ssh, "pm2 list --no-color 2>&1 | grep citaflow", show_tail=False)
    ok("PM2 processes running:")
    for line in status.split("\n"):
        if line.strip():
            safe_line = line.encode("ascii", "replace").decode("ascii")
            print(f"    {safe_line}")

    # ── 9. Nginx config ───────────────────────────────────────────────────────
    step(9, TOTAL_STEPS, "Configuring Nginx...")

    def make_nginx_conf(listen_port):
        return textwrap.dedent(f"""\
            server {{
                listen {listen_port};
                server_name {HOST} _;

                # API
                location /api {{
                    proxy_pass         http://127.0.0.1:{API_PORT};
                    proxy_http_version 1.1;
                    proxy_set_header   Host              $host;
                    proxy_set_header   X-Real-IP         $remote_addr;
                    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
                    proxy_read_timeout 60s;
                }}

                # WhatsApp webhook
                location /whatsapp {{
                    proxy_pass         http://127.0.0.1:{API_PORT};
                    proxy_http_version 1.1;
                    proxy_set_header   Host              $host;
                    proxy_set_header   X-Real-IP         $remote_addr;
                }}

                # Frontend (Next.js)
                location / {{
                    proxy_pass         http://127.0.0.1:{WEB_PORT};
                    proxy_http_version 1.1;
                    proxy_set_header   Host              $host;
                    proxy_set_header   X-Real-IP         $remote_addr;
                    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
                    proxy_set_header   Upgrade           $http_upgrade;
                    proxy_set_header   Connection        "upgrade";
                    proxy_read_timeout 60s;
                }}
            }}
        """)

    conf_path = "/etc/nginx/sites-available/citaflow"

    if port80_taken:
        # Port 80 belongs to another project — use port 8080 for CitaFlow
        # Remove the default site so it doesn't try to bind port 80 and crash Nginx
        run(ssh, "rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true", show_tail=False)
        nginx_conf = make_nginx_conf(8080)
        sftp.putfo(io.BytesIO(nginx_conf.encode()), conf_path)
        run(ssh, f"ln -sf {conf_path} /etc/nginx/sites-enabled/citaflow 2>/dev/null || true", show_tail=False)
        # Try to reload nginx (it might work on port 8080 even if 80 is taken)
        test_out, test_code = run(ssh, "nginx -t 2>&1", show_tail=False)
        if test_code == 0:
            run(ssh, "systemctl restart nginx 2>/dev/null || true", timeout=15, show_tail=False)
            ok("Nginx config written for port 8080 (port 80 is used by other project)")
            info(f"CitaFlow accessible at:  http://{HOST}:8080")
        else:
            ok(f"Nginx config saved to {conf_path} (manual enable needed)")
            info(f"CitaFlow accessible directly at:  http://{HOST}:{WEB_PORT}")
    else:
        nginx_conf = make_nginx_conf(80)
        sftp.putfo(io.BytesIO(nginx_conf.encode()), conf_path)
        run(ssh, "rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true", show_tail=False)
        run(ssh, f"ln -sf {conf_path} /etc/nginx/sites-enabled/citaflow", show_tail=False)
        test_out, test_code = run(ssh, "nginx -t 2>&1", show_tail=False)
        if test_code == 0:
            run(ssh, "systemctl restart nginx", timeout=15, show_tail=False)
            ok("Nginx configured on port 80 and reloaded")
        else:
            safe_err = test_out.encode("ascii", "replace").decode("ascii")
            print(f"    [warn] Nginx config test failed: {safe_err[:200]}")

    # ── Done ──────────────────────────────────────────────────────────────────
    sftp.close()
    ssh.close()

    banner("Deployment complete!")
    if port80_taken:
        print(f"  Landing page : http://{HOST}:8080  (or direct: http://{HOST}:{WEB_PORT})")
        print(f"  API health   : http://{HOST}:{API_PORT}/api")
    else:
        print(f"  Landing page : http://{HOST}")
        print(f"  API          : http://{HOST}/api")
    print()
    print("  Next steps:")
    print("  1. Set your WhatsApp credentials in:")
    print(f"       {REMOTE}/apps/api/.env")
    print("       -> WHATSAPP_PHONE_NUMBER_ID")
    print("       -> WHATSAPP_ACCESS_TOKEN")
    print("  2. Restart API:  pm2 restart citaflow-api")
    print("  3. Monitor:      pm2 logs")
    print("  4. PM2 status:   pm2 status")
    print()

if __name__ == "__main__":
    main()
