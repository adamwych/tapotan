export default class EventEmitter {
    private listeners = {};

    protected emit(name: string, data: any) {
        if (name in this.listeners) {
            this.listeners[name].forEach(listener => {
                listener(data);
            });
        }
    }

    public on(name: string, callback: Function) {
        if (name in this.listeners) {
            this.listeners[name].push(callback);
        } else {
            this.listeners[name] = [callback];
        }
    }

    public off(name: string, callback: Function) {
        if (name in this.listeners) {
            let list = this.listeners[name];
            let index = list.indexOf(callback);
            if (index > -1) {
                list.splice(index, 1);
            }

            this.listeners[name] = list;
        }
    }
}