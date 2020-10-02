import { Client } from './client'

export class Consult {
    constructor(
        public $key: string,
        public id: number,
        public clientKey: string,
        public pet: string,
        public treatment: string,
        public medicine: string,
        public price: number,
        public discount: number,
        public total: number
    ) {}
}
