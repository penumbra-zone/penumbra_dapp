import { createRouterTransport } from "@bufbuild/connect";
import { ViewProtocolService } from "@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect";
import { Message } from "@bufbuild/protobuf";
import type { JsonValue } from "@bufbuild/protobuf";
import { StatusRequest, StatusResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'

export const createWebExtTransport = (s: typeof ViewProtocolService) =>
  createRouterTransport(({ service }) => {
    type ExtensionResponse = { response: JsonValue; typeName: string };
    type ResolveReject = {
      resolve: (value: ExtensionResponse) => void;
      reject: (reason?: any) => void;
    };

    const pending = {
      sequence: 0,
      requests: new Map<number, ResolveReject>(),
    };

    const responseListener = (event: MessageEvent) => {
      if (event.source !== window)
        return console.info("client ignoring source", event.source);
      if (event.data?.type === "BUF_TRANSPORT_REQUEST") return;
      if (event.data?.type !== "BUF_TRANSPORT_RESPONSE")
        return console.info("client ignoring type", event.data?.type);
      const { sequence, success, error } = event.data;
      const { response, typeName }: ExtensionResponse = event.data;
      console.log("client accepted", event.data);
      const { resolve, reject } = pending.requests.get(sequence)!;
      // TODO: streams instead of immediate deletion
      if (!pending.requests.delete(sequence))
        console.error("ResponseListener bad sequence", event.data);
      success ? resolve({ response, typeName }) : reject(error);
    };
    window.addEventListener("message", responseListener);

    const requestEmitter = (
      request: JsonValue,
      typeName: string
    ): Promise<ExtensionResponse> => {
      const sequence = ++pending.sequence;
      const promiseResponseJson = new Promise<ExtensionResponse>(
        (resolve, reject) =>
          // TODO: timeout according to transport options
          pending.requests.set(sequence, { resolve, reject })
      );
      window.postMessage({
        type: "BUF_TRANSPORT_REQUEST",
        sequence,
        request,
        typeName,
      });
      return promiseResponseJson;
    };

    const extensionClient = async <T>(message: Message): Promise<T> => {
      const { response, typeName } = await requestEmitter(
        message.toJson(),
        message.getType().typeName
      );
      console.log({response});
      
      // TODO: coerce more specifically
      return response as T;
    };

    service(s, {
      // TODO introduce streaming
      // TODO converse bidi
      status: async (message: StatusRequest) => {
        return new StatusResponse(await extensionClient(message));
      },
    });
  });
