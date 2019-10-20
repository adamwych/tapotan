import GameObjectComponent from "../GameObjectComponent";
import GameObject from "../GameObject";
import GameObjectComponentLivingEntity from "./GameObjectComponentLivingEntity";
import Tapotan from "../../core/Tapotan";

export default class GameObjectComponentNoteBlock extends GameObjectComponent {

    private note: string;
    private canPlaySound: boolean = true;

    private notes = [
        'c1',
        'cs1',
        'd1',
        'ds1',
        'e1',
        'f1',
        'fs1',
        'g1',
        'gs1',
        'a1',
        'as1',
        'b1',
        'c2',
        'cs2',
        'd2',
        'ds2',
        'e2',
        'f2',
        'fs2',
        'g2',
        'gs2',
        'a2',
        'as2',
        'b2',
        'c3'
    ];

    public initialize(note: string = 'c1'): void {
        this.note = note;
        this.gameObject.on('collisionStart', this.handleCollisionStart); 
    }

    protected destroy(): void {
        this.gameObject.off('collisionStart', this.handleCollisionStart); 
    }

    public readCustomSerializationProperties(props: any) {
        this.note = props.note;
    }

    public getCustomSerializationProperties() {
        return {
            note: this.note
        }
    }

    private handleCollisionStart = (another: GameObject, event) => {
        if (!this.canPlaySound) {
            return;
        }

        if (another.hasComponentOfType(GameObjectComponentLivingEntity)) {
            this.canPlaySound = false;

            Tapotan.getInstance().getAudioManager().playSoundEffect('noteblock_note_' + this.note);

            setTimeout(() => {
                this.canPlaySound = true;
            }, 100);
        }
    }

    public increaseNote() {
        let nextNoteIndex = 0;
        let currentNoteIndex = this.notes.indexOf(this.note);
        if (currentNoteIndex === this.notes.length - 1) {
            nextNoteIndex = 0;
        } else {
            nextNoteIndex = currentNoteIndex + 1;
        }

        this.note = this.notes[nextNoteIndex];
    }

    public getNote() {
        return this.note;
    }

}