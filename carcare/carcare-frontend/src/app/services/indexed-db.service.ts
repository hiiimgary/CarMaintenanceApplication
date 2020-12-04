import { Injectable } from '@angular/core';
import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { Car, Deadline, Fuel, Insurance, Repair, Toll } from '../models/car.model';
import { v4 as generateKey } from 'uuid';

interface SyncDB extends DBSchema {
  'jwt-token': {
    key: string;
    value: string;
  };
  add_fuel: {
    key: string;
    value: {
      fuel: Fuel,
      car_id: string;
    }
  };
  add_car: {
    key: string;
    value: {
      car: Car
    }
  };
  add_repair: {
    key: string;
    value: {
      repair: Repair,
      car_id: string;
    }
  };
  add_insurance: {
    key: string;
    value: {
      insurance: Insurance,
      car_id: string;
    }
  };
  add_deadline: {
    key: string;
    value: {
      deadline: Deadline,
      car_id: string;
    }
  };
  add_toll: {
    key: string;
    value: {
      toll: Toll,
      car_id: string;
    }
  };
  delete_fuel: {
    key: string;
    value: {
      fuel_id: string,
      car_id: string;
    }
  };
  delete_repair: {
    key: string;
    value: {
      repair_id: string,
      car_id: string;
    }
  };
  delete_insurance: {
    key: string;
    value: {
      insurance_id: string,
      car_id: string;
    }
  };
  delete_deadline: {
    key: string;
    value: {
      deadline_id: string,
      car_id: string;
    }
  };
  delete_toll: {
    key: string;
    value: {
      toll_id: string,
      car_id: string;
    }
  };
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private db: IDBPDatabase<SyncDB>;
  constructor() {
    this.setUpDB();
  }

  async setUpDB(){
    this.db = await openDB<SyncDB>('sync-db', 1, {
      upgrade(db) {
        db.createObjectStore('jwt-token');
        db.createObjectStore('add_car');
        db.createObjectStore('add_fuel');
        db.createObjectStore('add_repair');
        db.createObjectStore('add_insurance');
        db.createObjectStore('add_deadline');
        db.createObjectStore('add_toll');
        db.createObjectStore('delete_fuel');
        db.createObjectStore('delete_repair');
        db.createObjectStore('delete_insurance');
        db.createObjectStore('delete_deadline');
        db.createObjectStore('delete_toll');
      }
    });
  }

  async setJWT(token: string){
    return await this.db.put('jwt-token', token , 'header');
  }

  async addFuel(fuel: Fuel, car_id: string) {
    return await this.db.put('add_fuel', { fuel: fuel, car_id: car_id }, generateKey());
  }

  async addCar(car: Car) {
    return await this.db.put('add_car', { car: car }, generateKey());
  }

  async addRepair(repair: Repair, car_id: string) {
    return await this.db.put('add_repair', { repair: repair, car_id: car_id }, generateKey());
  }

  async addInsurance(insurance: Insurance, car_id: string) {
    return await this.db.put('add_insurance', { insurance: insurance, car_id: car_id }, generateKey());
  }

  async addDeadline(deadline: Deadline, car_id: string) {
    return await this.db.put('add_deadline', { deadline: deadline, car_id: car_id }, generateKey());
  }

  async addToll(toll: Toll, car_id: string) {
    return await this.db.put('add_toll', { toll: toll, car_id: car_id }, generateKey());
  }

  async deleteFuel(fuel: string, car_id: string) {
    return await this.db.put('delete_fuel', { fuel_id: fuel, car_id: car_id }, generateKey());
  }

  async deleteRepair(repair: string, car_id: string) {
    return await this.db.put('delete_repair', { repair_id: repair, car_id: car_id }, generateKey());
  }

  async deleteInsurance(insurance: string, car_id: string) {
    return await this.db.put('delete_insurance', { insurance_id: insurance, car_id: car_id }, generateKey());
  }

  async deleteDeadline(deadline: string, car_id: string) {
    return await this.db.put('delete_deadline', { deadline_id: deadline, car_id: car_id }, generateKey());
  }

  async deleteToll(toll: string, car_id: string) {
    return await this.db.put('delete_toll', { toll_id: toll, car_id: car_id }, generateKey());
  }

}
