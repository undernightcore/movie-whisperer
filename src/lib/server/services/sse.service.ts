export class SSEService {
	#clients = new Map<number, ReadableStreamDefaultController<unknown>>();

	addClient(id: number, controller: ReadableStreamDefaultController<unknown>) {
		this.#clients.set(id, controller);
	}

	removeClient(id: number) {
		this.#clients.delete(id);
	}

	sendMessage(value: string) {
		this.#clients.forEach((client) => client.enqueue(`data: ${value}\n\n`));
	}
}

export const sse = new SSEService();
