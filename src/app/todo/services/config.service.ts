import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public readonly sourceV1: string = 'https://todo-nest-api.onrender.com/api/v1' // 'http://localhost:10000/api/v1';


  constructor() { }
}
