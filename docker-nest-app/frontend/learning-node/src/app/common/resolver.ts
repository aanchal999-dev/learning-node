import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";
import { EMPTY, mergeMap, of, take } from "rxjs";

export const resolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ) =>
{
  const _authservice = inject(AuthenticationService);

  switch(state.url)
  {
    case '/dashboard':
      console.log(state);

        return _authservice.getUser()
          .pipe(
            take(1),
            mergeMap((userdata) => {
              if(userdata)
                {
                  return of(userdata);
                }
              return EMPTY;
            })
          )
    default:
      return EMPTY;
  }
}
