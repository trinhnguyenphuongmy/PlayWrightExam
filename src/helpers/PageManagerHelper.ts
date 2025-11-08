import { Page } from '@playwright/test';

export class PageManagerHelper{
    private page: Page;
    private pageInstances: Map<string, any> = new Map();

    constructor(page: Page){
        this.page = page;
    }

    getPage<T>(pageClass: {new(page:Page): T}): T{
        if(!this.pageInstances.has(pageClass.name)){
            const instance = new pageClass(this.page);
            this.pageInstances.set(pageClass.name, instance);
        }
        return this.pageInstances.get(pageClass.name) as T;
    }
}