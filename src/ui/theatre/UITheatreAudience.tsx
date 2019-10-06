import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';

export default function UITheatreAudience() {
    const people = useRef<Array<HTMLElement>>([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            people.current.forEach(person => {
                if (person) {
                    person.classList.add('attr--stage-2');
                }
            });
        }, 5000);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div className="screen-theatre-layer-audience">
            <div className="screen-theatre-audience-person-1" ref={element => people.current[0] = element}>
                <img src={getBundledResourceAsDataURL('Graphics/Theatre/Audience/Person1.svg', false)} />
            </div>

            <div className="screen-theatre-audience-person-2" ref={element => people.current[1] = element}>
                <img src={getBundledResourceAsDataURL('Graphics/Theatre/Audience/Person2.svg', false)} />
            </div>

            <div className="screen-theatre-audience-person-3" ref={element => people.current[2] = element}>
                <img src={getBundledResourceAsDataURL('Graphics/Theatre/Audience/Person3.svg', false)} />
            </div>

            <div className="screen-theatre-audience-person-4" ref={element => people.current[3] = element}>
                <img src={getBundledResourceAsDataURL('Graphics/Theatre/Audience/Person4.svg', false)} />
            </div>

            <div className="screen-theatre-audience-person-5" ref={element => people.current[4] = element}>
                <img src={getBundledResourceAsDataURL('Graphics/Theatre/Audience/Person5.svg', false)} />
            </div>

            <div className="screen-theatre-audience-person-6" ref={element => people.current[5] = element}>
                <img src={getBundledResourceAsDataURL('Graphics/Theatre/Audience/Person6.svg', false)} />
            </div>
        </div>
    )
}