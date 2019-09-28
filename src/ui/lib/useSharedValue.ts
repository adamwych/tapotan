import { useState, useCallback, useEffect } from 'react';

const SharedValues = {};

export default function useSharedValue(name: string, defaultValue: any) {
    const [_value, _setValue] = useState(SharedValues[name] || defaultValue);

    const setValue = (newValue: any) => {
        SharedValues[name].value = newValue;
        SharedValues[name].listeners.forEach(listener => {
            listener(newValue);
        });
    };

    const handleValueChanged = useCallback(newValue => {
        _setValue(newValue);
    }, []);

    if (!(name in SharedValues)) {
        SharedValues[name] = {
            value: defaultValue,
            listeners: []
        };
    }

    const value = SharedValues[name].value;

    useEffect(() => {
        SharedValues[name].listeners.push(handleValueChanged);

        return () => {
            SharedValues[name].listeners.splice(SharedValues[name].listeners.indexOf(handleValueChanged), 1);
        };
    }, []);

    return [value, setValue];
}