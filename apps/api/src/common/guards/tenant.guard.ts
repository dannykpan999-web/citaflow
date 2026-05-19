import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '../../database/entities/user.entity'

export const SKIP_TENANT_CHECK = 'skipTenantCheck'

/**
 * Enforces that the authenticated user belongs to the tenant they are acting on.
 * Super admins bypass this check entirely.
 *
 * Routes can opt out with @SkipTenantCheck() for endpoints like /admin that
 * intentionally cross tenant boundaries.
 *
 * Also validates that the JWT payload carries a tenantId (catches misconfigured tokens).
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_TENANT_CHECK, [
      ctx.getHandler(),
      ctx.getClass(),
    ])
    if (skip) return true

    const req = ctx.switchToHttp().getRequest()
    const user = req.user

    if (!user) return false

    // Super admins can access any tenant
    if (user.role === UserRole.SUPER_ADMIN) return true

    // Every non-super-admin must have a tenantId in their JWT
    if (!user.tenantId) {
      throw new ForbiddenException('Token missing tenantId')
    }

    // If the route exposes an explicit :tenantId param, validate it matches
    const paramTenantId = req.params?.tenantId
    if (paramTenantId && paramTenantId !== user.tenantId) {
      throw new ForbiddenException('Tenant mismatch')
    }

    return true
  }
}
