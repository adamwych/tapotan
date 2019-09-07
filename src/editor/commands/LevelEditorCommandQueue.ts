import LevelEditorCommand from "./LevelEditorCommand";
import LevelEditorContext from "../LevelEditorContext";

export default class LevelEditorCommandQueue {

    /**
     * Context in which the commands will be executed.
     */
    private context: LevelEditorContext;

    /**
     * List of all pending commands.
     */
    private queue: Array<LevelEditorCommand> = [];

    /**
     * List of last N executed commands.
     */
    private history: Array<LevelEditorCommand> = [];
    private maxHistoryEntries = 50;

    /**
     * Whether queue is being executed right now.
     */
    private duringExecution: boolean = false;

    /**
     * Constructs a new {@link LevelEditorCommandQueue}
     * @param context Context in which commands should be executed.
     */
    constructor(context: LevelEditorContext) {
        this.context = context;
    }

    /**
     * Enqueues given command.
     * @param command 
     */
    public enqueueCommand(command: LevelEditorCommand) {
        this.queue.push(command);

        // Do not try to execute multiple commands at the same time.
        if (!this.duringExecution) {
            this.executeCommandsFromQueue();
        }
    }

    private executeCommandsFromQueue() {
        if (this.queue.length === 0) {
            return;
        }

        this.duringExecution = true;

        // Execute first command from the queue.
        const command = this.queue[0];
        command.execute(this.context);

        if (this.history.length >= this.maxHistoryEntries) {
            this.history.splice(0, 1);
        }

        this.history.push(command);
        this.queue.splice(0, 1);

        this.duringExecution = false;

        // If there are more command, execute them immedietely.
        if (this.queue.length > 0) {
            this.executeCommandsFromQueue();
        }
    }

    public getQueue(): Array<LevelEditorCommand> {
        return this.queue;
    }

    public getHistory(): Array<LevelEditorCommand> {
        return this.history;
    }

    public clearHistory() {
        this.history = [];
    }

}