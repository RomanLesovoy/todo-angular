import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public readonly sourceV1: string = isDevMode() 
    ? 'http://localhost:3000/api/v1'
    : 'https://todo-nest-api.onrender.com/api/v1';

  public readonly sourceWs: string = isDevMode() 
    ? 'ws://localhost:3000'
    : 'https://todo-nest-api.onrender.com';

  constructor() { }
}
