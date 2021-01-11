import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Car, Currency, Fuel, FuelType } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';
import { createWorker } from 'tesseract.js';

@Component({
  selector: 'app-add-fuel',
  templateUrl: './add-fuel.component.html',
  styleUrls: ['./add-fuel.component.scss']
})
export class AddFuelComponent implements OnInit {
  car: Car;
  addFuel: FormGroup;
  bill: string = '';
  billCompressed: string = '';
  billText: string = '';
  reading: boolean = false;
  fueltypeOptions: string[];
  currencyEnum = Currency;
  keys = Object.keys;
  ocrEnabled: boolean = false;
  compressing: boolean = false;
  progress: number = 0;

  constructor(private fb: FormBuilder, private carService: CarService, private router: Router, private imageCompress: NgxImageCompressService, private _datepipe: DatePipe) { }

  ngOnInit(): void {
    this.carService.activeCar.subscribe(car => {
      this.car = car;
      if (this.car.fuel_type == FuelType.diesel) {
        this.fueltypeOptions = ['B7', 'B10', 'XTL'];
      } else {
        this.fueltypeOptions = ['E5', 'E10', 'E85'];
      }
    });

    this.addFuel = this.fb.group({
      date: ['', [
        Validators.required
      ]],
      station: ['', [
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3)
      ]],
      type: [this.fueltypeOptions[0], [
        Validators.required
      ]],
      amount: ['', [
        Validators.required,
        Validators.min(1)
      ]],
      price: ['', [
        Validators.required,
        Validators.min(1),
      ]],
      currency: [Currency.HUF, [
        Validators.required,
        Validators.min(0)
      ]],
      mileage: ['', [
        Validators.required,
        Validators.min(0),
        Validators.maxLength(7)
      ]]
    })
  }

  changeFuelType(e) {
    var str = e.target.value.split(" ");
    this.type.setValue(str[1]);
  }

  changeCurrency(e) {
    var str = e.target.value.split(" ");
    this.currency.setValue(str[1]);
  }

  save() {
    if (!this.reading) {
      const refill = this.addFuel.value;
      refill.date = new Date(refill.date);
      refill.bill = this.billCompressed;
      this.carService.addFuel(refill);
      this.navigateTo('service/fuel');
    }


  }

  onReadBill(event) {
    let m = this;
    this.compressing = true;
    var image = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function () {
      m.bill = reader.result as string;
      m.imageCompress.compressFile(m.bill, 1, 50, 50).then(
        result => {
          m.billCompressed = result;
          m.compressing = false;
        }
      );
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };

    if (this.ocrEnabled) {
      this.recognizeImage(image);
    }

  }

  async recognizeImage(image: any){
    console.log('Reading...');
    this.reading = true;
    const worker = createWorker({
      logger: m => this.setProgress(m),
    });
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(image);
    await worker.terminate();
    this.reading = false;
    this.extractInformation(text);
    
  }

  setProgress(m: any) {
    if (m.status == 'recognizing text') {
      this.progress = Math.round(m.progress * 100);
    }
  }

  extractInformation(text: string) {
    if (text.includes('SHELL')) {
      this.station.setValue('SHE');
      let lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('NYUGTA') && i < lines.length - 3) {
          if (lines[i + 1].includes('X')) {
            let amount = lines[i + 1].split('X')[0];
            if (!isNaN(Number(amount))) {
              this.amount.setValue(Number(amount));
            }
          } else if (lines[i + 1].includes('X')) {
            let amount = lines[i + 1].split('X')[0];
            if (!isNaN(Number(amount))) {
              this.amount.setValue(Number(amount));
            }
          }
        }
      }
    }
    let date = text.match(/([12]\d{3}.(0[1-9]|1[0-2]).(0[1-9]|[12]\d|3[01]))/);
    if(date){
      this.date.setValue(this._datepipe.transform(new Date(date[0]), 'yyyy-MM-dd'));
    }
  }


  navigateTo(url) {
    this.router.navigate(['user/' + url]);
  }

  get date() {
    return this.addFuel.get('date');
  }

  get station() {
    return this.addFuel.get('station');
  }

  get type() {
    return this.addFuel.get('type');
  }

  get amount() {
    return this.addFuel.get('amount');
  }

  get price() {
    return this.addFuel.get('price');
  }

  get currency() {
    return this.addFuel.get('currency');
  }

  get mileage() {
    return this.addFuel.get('mileage');
  }
}
