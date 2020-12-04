import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Car, Fuel, Repair } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarExportService {
  pdfMake: any;

  constructor(private _datepipe: DatePipe) { }

  async loadPdfMaker(){
    if(!this.pdfMake){
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
  }

  async generateCarExport(car: Car){
    await this.loadPdfMaker();
    const carExport = {
      content: [
        {text: car.license_plate, style: 'header'},

        {
          style: 'table',
          table: {
            body: [
              ['Manufacturer', car.brand],
              ['Model', car.car_model],
              ['License Plate', car.license_plate],
              ['Release Year', car.release_year],
              ['VIN', car.vin],
              ['Fuel Type', car.fuel_type],
            ]
          },
          layout: 'noBorders'
        },
        { text: 'Refills' , style: 'subheader'},
        this.fuelTable(car.refueling),
        { text: 'Service' , style: 'subheader'},
        this.serviceTable(car.repairs)

      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        table: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    }

    this.pdfMake.createPdf(carExport).open();
  }

  fuelData(refills: Fuel[]){
    var body = [];
    
    body.push([
      {text:'Date' ,style: 'tableHeader'}, 
      {text:'Gas Station' ,style: 'tableHeader'}, 
      {text:'Amount' ,style: 'tableHeader'}, 
      {text:'Price' ,style: 'tableHeader'},
      {text:'Consumption' ,style: 'tableHeader'},
      {text:'Mileage' ,style: 'tableHeader'}
    ]);



    for(let i = 0; i < refills.length; i++){
      let consumption = 0;
      if(i < refills.length - 1){
        let distance = refills[i].mileage - refills[i+1].mileage;
        let con = refills[i].amount / distance * 100;
        con = Math.round((con + Number.EPSILON) * 10) / 10;
        consumption = con;
      }
      body.push([this._datepipe.transform(refills[i].date, 'yyyy.MM.dd'), refills[i].station, refills[i].amount + 'L', refills[i].price + ' ' + refills[i].currency, consumption > 0 ? consumption + ' L' : '-', refills[i].mileage])
    }

    return body;
  }

  serviceData(repairs: Repair[]){
    var body = [];
    body.push([{text:'Date', style: 'tableHeader'}, {text:'Type', style: 'tableHeader'}, {colSpan: 3, text:'Service Information', style:'tableHeader'}, '', '']);
    repairs.forEach(repair => {
      let rowSpan = repair.diy ? repair.parts.length : repair.parts.length + 1;
      if(repair.service){
        body.push([
          {rowSpan: rowSpan, text: repair.date}, 
          {rowSpan: rowSpan, text: 'Service Repair'}, 
          repair.service.company_name + ' \n' + repair.service.company_address ? repair.service.company_address : '-', 
          repair.service.description, 
          repair.service.fee + ' ' + repair.service.currency
        ]);
        if(repair.parts){
          repair.parts.forEach(part => {
            body.push([{}, {}, part.name, part.reason_of_interchange, part.price + ' ' + part.currency]);
          })
        }
      } else if(repair.parts.length > 0) {
        body.push([
          {rowSpan: rowSpan, text: repair.date}, 
          {rowSpan: rowSpan, text: 'Self Repair'}, 
          repair.parts[0].name, 
          repair.parts[0].reason_of_interchange,
          repair.parts[0].price + ' ' + repair.parts[0].currency
        ]);
        for(let i = 1; i < repair.parts.length; i++){
          body.push(['', '', repair.parts[i].name, repair.parts[i].reason_of_interchange, repair.parts[i].price + ' ' + repair.parts[i].currency]);
        }
      }
    });
    return body;
  }

  fuelTable(refills: Fuel[]){
    return {
      style: 'table',
      table: {
        headerRows: 1,
        keepWithHeaderRows: 1,
        body: this.fuelData(refills)
      },
      layout: {
				fillColor: function (rowIndex) {
					return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
				}
			}
    }
  }
  serviceTable(repairs: Repair[]){
    return {
      style: 'table',
      table: {
        headerRows: 1,
        keepWithHeaderRows: 1,
        body: this.serviceData(repairs)
      }
    }
  }

}
