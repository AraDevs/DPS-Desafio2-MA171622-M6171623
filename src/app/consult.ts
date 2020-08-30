import { Client } from './client'

export class Consult {
    constructor(
        public client: Client,
        public pet: string,
        public treatment: string,
        public medicine: string,
        public price: number,
        public discount: number,
        public total: number
    ) {}
}
