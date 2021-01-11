import { Injectable } from '@angular/core';

@Injectable()
export class Globals { // important global variables are stored here.
    readonly BASE_URL: string = "http://localhost:3000/api";  

}