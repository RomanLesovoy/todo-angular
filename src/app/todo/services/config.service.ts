import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public readonly sourceV1: string = 'http://localhost:3000/api/v1';


  constructor() { }
}
