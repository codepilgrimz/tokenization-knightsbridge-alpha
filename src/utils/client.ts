// Optional arguments used when initiating a session
export interface SessionArgs {
    oneTime?: boolean;
}

// Arguments that can be passed when requesting authorization
export interface AuthorizeArgs {
    message?: string;
    session?: SessionArgs;
}

// Structure for the result when authorization returns a credential
export interface AuthorizeResultCredential {
    raw?: unknown;
    cesr: string;
}

// Structure for the result when authorization returns an identifier
export interface AuthorizeResultIdentifier {
    prefix: string;
}

// Overall result structure from an authorization request
export interface AuthorizeResult {
    credential?: AuthorizeResultCredential;
    identifier?: AuthorizeResultIdentifier;
    headers?: Record<string, string>;
}

// Internal structure used to keep track of pending requests and their resolvers
type Pending = { resolve: (v: any) => void; reject: (e: Error) => void };

// A helper class that wraps a Promise and exposes its resolve/reject functions
class Deferred<T> {
    promise: Promise<T>;
    resolve: (value: T) => void = () => { };
    reject: (reason?: Error) => void = () => { };

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

// Options used to initialize the ExtensionClient
export interface ExtensionClientOptions {
    targetOrigin?: string; // Defaults to the current page's origin if not provided
}

// Main client for communicating with the browser extension
export class ExtensionClient {
    #requests = new Map<string, Pending>(); // Stores pending requests by ID
    #extensionIdPromise: Deferred<string | false> = new Deferred<string | false>(); // Promise for checking if extension is installed

    /**
     * Constructs a new ExtensionClient instance.
     *
     * @param {ExtensionClientOptions} [options] - Optional options
     * @param {string} [options.targetOrigin] - The target origin to post messages to. Defaults to the page's origin.
     */
    constructor(private options: ExtensionClientOptions = {}) {
        this.sendMessage = this.sendMessage.bind(this);

        // Listen for messages posted back from the extension
        window.addEventListener("message", this.#handleEvent, false);

        // Send initial handshake message to detect if the extension is installed
        window.postMessage({ type: "signify-extension-client" }, this.options.targetOrigin ?? "/");
    }

    /**
     * Handles incoming messages from the extension via postMessage.
     */
    #handleEvent = (event: MessageEvent) => {
        if (event.source !== window) return; // Only accept messages from same window
        if (!event.data || typeof event.data !== "object") return;

        const { type, requestId, error, payload } = event.data ?? {};

        // Handles the response that confirms the extension is installed
        if (type === "signify-extension") {
            this.#extensionIdPromise.resolve(event.data.data?.extensionId ?? false);
            return;
        }

        // Handles reply to a request sent previously
        if (type === "/signify/reply" && typeof requestId === "string") {
            const pending = this.#requests.get(requestId);
            if (!pending) return;

            if (error) {
                // If an error was returned, reject the promise
                pending.reject(new Error(typeof error === "string" ? error : String(error)));
            } else if (!payload || typeof payload !== "object") {
                // If no payload was received, reject
                pending.reject(new Error("No payload received in response"));
            } else {
                // Structure the received payload into the expected AuthorizeResult format
                const structuredPayload: AuthorizeResult = {
                    credential: {
                        raw: payload.credential?.raw,
                        cesr: payload.credential?.cesr || JSON.stringify(payload.credential?.raw) // Fallback to raw if CESR is missing
                    }
                };
                pending.resolve(structuredPayload);
            }

            // Remove the request from the pending map
            this.#requests.delete(requestId);
        }
    };

    /**
     * Clears the session on the extension side.
     */
    clearSession = async (): Promise<void> => {
        await this.sendMessage("/signify/clear-session", { payload: {} as any });
    };

    /**
     * Checks whether the extension is installed.
     *
     * @param {number} timeout - Timeout in milliseconds before assuming it's not installed.
     * @returns {Promise<string | false>} - Returns the extension ID or false.
     */
    isExtensionInstalled = async (timeout = 3000): Promise<string | false> => {
        const t = setTimeout(() => this.#extensionIdPromise.resolve(false), timeout);
        const res = await this.#extensionIdPromise.promise;
        clearTimeout(t);
        return res;
    };

    /**
     * Sends a request to authorize a credential.
     *
     * @param {AuthorizeArgs} payload - Payload for the authorization request.
     * @returns {Promise<AuthorizeResult>} - Structured result from the extension.
     */
    authorizeCred = async (payload?: AuthorizeArgs): Promise<AuthorizeResult> => {
        return this.sendMessage("/signify/authorize/credential", { payload });
    };

    /**
     * Sends a message to the extension.
     *
     * @param {string} type - The message type (endpoint).
     * @param {TReq} payload - Optional payload to send.
     * @returns {Promise<TRes>} - Promise resolving with the expected response.
     */
    private async sendMessage<TReq extends object, TRes>(type: string, payload?: TReq): Promise<TRes> {
        const requestId = (window.crypto?.randomUUID?.() ?? String(Date.now() + Math.random()));

        // Store the promise resolver to be called when the reply comes back
        const promise = new Promise<TRes>((resolve, reject) => this.#requests.set(requestId, { resolve, reject }));

        // Send the message to the extension
        window.postMessage({ requestId, type, ...(payload ?? {}) }, this.options.targetOrigin ?? "/");

        return promise;
    }
}

/**
 * Factory function to create an ExtensionClient instance.
 *
 * @param {ExtensionClientOptions} [options] - Options to configure the client.
 * @returns {ExtensionClient} - A new instance of ExtensionClient.
 */
export function createClient(options?: ExtensionClientOptions) {
    return new ExtensionClient(options ?? {});
}
