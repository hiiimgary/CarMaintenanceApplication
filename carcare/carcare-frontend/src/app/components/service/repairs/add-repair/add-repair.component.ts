import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Car, Currency } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-add-repair',
  templateUrl: './add-repair.component.html',
  styleUrls: ['./add-repair.component.scss']
})
export class AddRepairComponent implements OnInit {

  car: Car;
  addRepair: FormGroup;
  serviceForm: FormGroup;
  currencyEnum = Currency;
  images: string[] = [];
  keys = Object.keys;
  isDIY: boolean = true;

  constructor(private fb: FormBuilder, private carService: CarService, private router: Router) { }

  ngOnInit(): void {
    this.carService.activeCar.subscribe(car => this.car = car);
    this.serviceForm = this.fb.group({
      company_name: ['', [
        Validators.required        
      ]],
      company_address: '',
      description: ['', [
        Validators.required        
      ]],
      fee: ['', [
        Validators.required        
      ]],
      currency: ['', [
        Validators.required        
      ]]
    });

    this.addRepair = this.fb.group({
      date: ['', [
        Validators.required        
      ]],
      mileage: ['', [
        Validators.required        
      ]],
      service: this.fb.group({}),
      parts: this.fb.array([])
    })
  }

  onUploadBill(event){
    let m = this;
    for(let i = 0; i < event.target.files.length; i++){
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onload = function () {
        m.images.push(reader.result as string);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }


  }



  save(){
    const repair = this.addRepair.value;
    repair.diy = this.isDIY;
    repair.bills = this.images;
    this.carService.addRepair(repair);
    this.navigateTo('repairs');
  }

  navigateTo(url: string){
    this.router.navigate(['/user/service/' + url]);
  }

  addPart(){
    const part = this.fb.group({
      name: ['', [
        Validators.required        
      ]],
      reason_of_interchange: ['', [
        Validators.required        
      ]],
      price: ['', [
        Validators.required        
      ]],
      currency: ['', [
        Validators.required        
      ]]
    });
    this.partForms.push(part);
  }

  deletePart(i){
    this.partForms.removeAt(i);
  }

  setDIY(isDIY: boolean){
    this.isDIY = isDIY;
    if(isDIY){
      this.addRepair.setControl('service', null);
    } else {
      this.addRepair.setControl('service', this.serviceForm);
    }
  }

  get partForms(){
    return this.addRepair.get('parts') as FormArray;
  }

  getName(i){
    return this.partForms.at(i).get('name');
  }

  getReasonOfInterchange(i){
    return this.partForms.at(i).get('reason_of_interchange');
  }

  getPrice(i){
    return this.partForms.at(i).get('price');
  }

  getCurrency(i){
    return this.partForms.at(i).get('currency');
  }

  get date(){
    return this.addRepair.get('date');
  }

  get mileage(){
    return this.addRepair.get('mileage');
  }

  get company_name(){
    return this.serviceForm.get('company_name');
  }

  get company_address(){
    return this.serviceForm.get('company_address');
  }

  get description(){
    return this.serviceForm.get('description');
  }

  get fee(){
    return this.serviceForm.get('fee');
  }

  get currency(){
    return this.serviceForm.get('currency');
  }
}