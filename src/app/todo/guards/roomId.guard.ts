import { Injectable, Inject } from "@angular/core";
import { CanActivate } from "@angular/router";
import { RoomServiceService } from "../services/room-service.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { catchError, map, Observable, of } from "rxjs";

@Injectable()
export class RoomIdGuard implements CanActivate {
    constructor(
        @Inject(RoomServiceService) private roomService: RoomServiceService,    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot
    ): Observable<boolean> {
        const hash = next.paramMap.get('hash');

        return hash ? this.roomService.setRoomIfExists(hash).pipe(
            map(v => !!v),
            catchError((e) => {
                console.error(e);
                return of(false);
            })
        ) : of(false);
    }
}
