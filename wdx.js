/**
 * Elrest - Node RED - Runtime Node
 * 
 * @copyright 2024 Elrest Automations Systeme GMBH
 */

module.exports = function (RED) {

	"use strict";

	const WDXSchema = require("@wago/wdx-schema");

	const WS_STATUS_ONLINE_COLOR = 'green'; //@todo Wago green not work as format: #6EC800 , rgb(110, 200, 0)
	const WS_STATUS_OFFLINE_COLOR = 'red';
	const WS_STATUS_ERROR_COLOR = 'red';
	const WS_STATUS_CONNECTING_COLOR = 'blue';

	const WS_STATUS_CODES = {
		CONNECTING: 'CONNECTING',
		OPEN: 'OPEN',
		CLOSING: 'CLOSING',
		CLOSED: 'CLOSED'
	};

	const NODE_STATUS = {
		OPEN: {
			fill: WS_STATUS_ONLINE_COLOR,
			shape: "dot",
			text: "Open"
		},
		ERROR: {
			fill: WS_STATUS_ERROR_COLOR,
			shape: "dot",
			text: "Error"
		},
		CLOSED: {
			fill: WS_STATUS_OFFLINE_COLOR,
			shape: "dot",
			text: "Closed"
		},
		CONNECTING: {
			fill: WS_STATUS_CONNECTING_COLOR,
			shape: "dot",
			text: "Connecting"
		},
		CLOSING: {
			fill: WS_STATUS_CONNECTING_COLOR,
			shape: "dot",
			text: "Closing"
		}
	};

	function EDesignRuntimeInstanceList(config) {

		//console.log("EDesignRuntimeInstanceList", config);

		RED.nodes.createNode(this, config);
		
		const wsClient = RED.nodes.getNode(config.client);

		if (wsClient) {
			this.status(NODE_STATUS.CONNECTING);

			wsClient.on('opened', (event) => {
				this.status(Object.assign(NODE_STATUS.OPEN, {
					event: "connect",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('erro', (event) => {
				this.status(Object.assign(NODE_STATUS.ERROR, {
					event: "error",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('closed', (event) => {
				this.status(Object.assign(NODE_STATUS.CLOSED, {
					event: "disconnect",
					_session: { type: "websocket", id: event.id }
				}));
			});

		} else {
			this.status(NODE_STATUS.ERROR);
		}

		this.on('input', (msg, nodeSend, nodeDone) => {

			//console.log("EDesignRuntimeInstanceList.input", msg, config);

			const request = new WDXSchema.WDX.Schema.Message.Instance.ListRequest(
			);

			const subscription = wsClient.wsMessages().subscribe(
				{
					next: (wsMessage) => {
						if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.InstanceListResponse
							&& wsMessage.uuid === request.uuid) {
							subscription.unsubscribe();

							if (undefined !== wsMessage.error) {
								this.send([null, wsMessage.error]);
							} else {
								msg.payload = wsMessage.body;
								this.send([msg, null, null]);
							}
						}
					},
					error: (wsError) => {
						console.error("EDesignRuntimeInstanceList.input.wsMessages.error", wsError);
						subscription.unsubscribe();
						this.send([null, wsError]);
					}
				}
			);

			wsClient.wsSend(request);
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeDataGetSchema.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.instance.list", EDesignRuntimeInstanceList);

	function EDesignRuntimeInstanceSave(config) {
		RED.nodes.createNode(this, config);
		const wsClient = RED.nodes.getNode(config.client);

		if (wsClient) {
			this.status(NODE_STATUS.CONNECTING);

			wsClient.on('opened', (event) => {
				this.status(Object.assign(NODE_STATUS.OPEN, {
					event: "connect",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('erro', (event) => {
				this.status(Object.assign(NODE_STATUS.ERROR, {
					event: "error",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('closed', (event) => {
				this.status(Object.assign(NODE_STATUS.CLOSED, {
					event: "disconnect",
					_session: { type: "websocket", id: event.id }
				}));
			});


		} else {
			this.status(NODE_STATUS.ERROR);
		}

		this.on('input', (msg, nodeSend, nodeDone) => {

			const instance = msg.instance ?? config['instance'] ?? undefined;
			if (undefined === instance) {
				return;
			}

			console.log("EDesignRuntimeInstanceSave.msg", instance);

			const request = new WDXSchema.WDX.Schema.Message.Instance.SaveRequest(
				instance,
			);

			const subscription = wsClient.wsMessages().subscribe(
				{
					next: (wsMessage) => {
						if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.InstanceSaveResponse
							&& wsMessage.uuid === request.uuid) {
							subscription.unsubscribe();

							console.log("EDesignRuntimeInstanceSave.wsMessage", wsMessage);
							if (undefined !== wsMessage.error) {
								this.send([null, wsMessage.error]);
							} else {
								msg.payload = wsMessage.body;
								this.send([msg, null, null]);
							}
						}
					},
					error: (wsError) => {
						console.error("EDesignRuntimeInstanceSave.input.wsMessages.error", wsError);
						subscription.unsubscribe();
						this.send([null, wsError]);
					}
				}
			);

			wsClient.wsSend(request);
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeInstanceSave.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.instance.save", EDesignRuntimeInstanceSave,);

	function EDesignRuntimeInstanceDetail(config) {
		RED.nodes.createNode(this, config);
		const wsClient = RED.nodes.getNode(config.client);

		if (wsClient) {
			this.status(NODE_STATUS.CONNECTING);

			wsClient.on('opened', (event) => {
				this.status(Object.assign(NODE_STATUS.OPEN, {
					event: "connect",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('erro', (event) => {
				this.status(Object.assign(NODE_STATUS.ERROR, {
					event: "error",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('closed', (event) => {
				this.status(Object.assign(NODE_STATUS.CLOSED, {
					event: "disconnect",
					_session: { type: "websocket", id: event.id }
				}));
			});


		} else {
			this.status(NODE_STATUS.ERROR);
		}

		this.on('input', (msg, nodeSend, nodeDone) => {

			const instanceUUID = msg.instanceUUID ?? config['instanceUUID'] ?? undefined;

			const request = new WDXSchema.WDX.Schema.Message.Instance.DetailRequest(
				instanceUUID,
			);

			const subscription = wsClient.wsMessages().subscribe(
				{
					next: (wsMessage) => {
						if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.InstanceDetailResponse
							&& wsMessage.uuid === request.uuid) {

							if (undefined !== wsMessage.error) {
								msg.payload = wsMessage.error;
								this.send([null, msg]);
							} else {
								msg.payload = wsMessage.body;
								this.send([msg, null, null]);
							}

							subscription.unsubscribe();
						}
					},
					error: (wsError) => {
						console.error("EDesignRuntimeInstanceDetail.input.wsMessages.error", wsError);
						subscription.unsubscribe();
						this.send([null, wsError]);
					}
				}
			);

			wsClient.wsSend(request);
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeInstanceDetail.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.instance.detail", EDesignRuntimeInstanceDetail,);

	function EDesignRuntimeInstanceStart(config) {
		RED.nodes.createNode(this, config);
		const wsClient = RED.nodes.getNode(config.client);

		if (wsClient) {
			this.status(NODE_STATUS.CONNECTING);

			wsClient.on('opened', (event) => {
				this.status(Object.assign(NODE_STATUS.OPEN, {
					event: "connect",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('erro', (event) => {
				this.status(Object.assign(NODE_STATUS.ERROR, {
					event: "error",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('closed', (event) => {
				this.status(Object.assign(NODE_STATUS.CLOSED, {
					event: "disconnect",
					_session: { type: "websocket", id: event.id }
				}));
			});


		} else {
			this.status(NODE_STATUS.ERROR);
		}

		this.on('input', (msg, nodeSend, nodeDone) => {

			const instanceUUID = msg.instanceUUID ?? config['instanceUUID'] ?? undefined;


			const request = new WDXSchema.WDX.Schema.Message.Instance.StartRequest(
				instanceUUID,
			);

			const subscription = wsClient.wsMessages().subscribe(
				{
					next: (wsMessage) => {
						if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.InstanceStartResponse
							&& wsMessage.uuid === request.uuid) {

							if (undefined !== wsMessage.error) {
								msg.payload = wsMessage.error;
								this.send([null, msg]);
							} else {
								msg.payload = wsMessage.body;
								this.send([msg, null, null]);
							}

							subscription.unsubscribe();

						}
					},
					error: (wsError) => {
						console.error("EDesignRuntimeInstanceDetail.input.wsMessages.error", wsError);
						subscription.unsubscribe();
						this.send([null, wsError]);
					}
				}
			);

			wsClient.wsSend(request);
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeInstanceDetail.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.instance.start", EDesignRuntimeInstanceStart);

	function EDesignRuntimeInstanceStop(config) {
		RED.nodes.createNode(this, config);
		
		const wsClient = RED.nodes.getNode(config.client);

		if (wsClient) {
			this.status(NODE_STATUS.CONNECTING);

			wsClient.on('opened', (event) => {
				this.status(Object.assign(NODE_STATUS.OPEN, {
					event: "connect",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('erro', (event) => {
				this.status(Object.assign(NODE_STATUS.ERROR, {
					event: "error",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('closed', (event) => {
				this.status(Object.assign(NODE_STATUS.CLOSED, {
					event: "disconnect",
					_session: { type: "websocket", id: event.id }
				}));
			});

		} else {
			this.status(NODE_STATUS.ERROR);
		}

		this.on('input', (msg, nodeSend, nodeDone) => {

			const instanceUUID = msg.instanceUUID ?? config['instanceUUID'] ?? undefined;

			const request = new WDXSchema.WDX.Schema.Message.Instance.StopRequest(
				instanceUUID,
			);

			const subscription = wsClient.wsMessages().subscribe(
				{
					next: (wsMessage) => {
						if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.InstanceStopResponse
							&& wsMessage.uuid === request.uuid) {

							if (undefined !== wsMessage.error) {
								msg.payload = wsMessage.error;
								this.send([null, msg]);
							} else {
								msg.payload = wsMessage.body;
								this.send([msg, null, null]);
							}

							subscription.unsubscribe();
						}
					},
					error: (wsError) => {
						console.error("EDesignRuntimeInstanceStop.input.wsMessages.error", wsError);
						subscription.unsubscribe();
						this.send([null, wsError]);
					}
				}
			);

			wsClient.wsSend(request);
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeInstanceStop.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.instance.stop", EDesignRuntimeInstanceStop);

	function EDesignRuntimeInstanceRestart(config) {
		RED.nodes.createNode(this, config);

		const wsClient = RED.nodes.getNode(config.client);

		if (wsClient) {
			this.status(NODE_STATUS.CONNECTING);

			wsClient.on('opened', (event) => {
				this.status(Object.assign(NODE_STATUS.OPEN, {
					event: "connect",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('erro', (event) => {
				this.status(Object.assign(NODE_STATUS.ERROR, {
					event: "error",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('closed', (event) => {
				this.status(Object.assign(NODE_STATUS.CLOSED, {
					event: "disconnect",
					_session: { type: "websocket", id: event.id }
				}));
			});

		} else {
			this.status(NODE_STATUS.ERROR);
		}

		this.on('input', (msg, nodeSend, nodeDone) => {

			const instanceUUID = msg.instanceUUID ?? config['instanceUUID'] ?? undefined;
			const request = new WDXSchema.WDX.Schema.Message.Instance.RestartRequest(
				instanceUUID,
			);

			const subscription = wsClient.wsMessages().subscribe(
				{
					next: (wsMessage) => {
						if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.InstanceRestartResponse
							&& wsMessage.uuid === request.uuid) {

							if (undefined !== wsMessage.error) {
								msg.payload = wsMessage.error;
								this.send([null, msg]);
							} else {
								msg.payload = wsMessage.body;
								this.send([msg, null, null]);
							}

							subscription.unsubscribe();
						}
					},
					error: (wsError) => {
						console.error("EDesignRuntimeInstanceRestart.input.wsMessages.error", wsError);
						subscription.unsubscribe();
						this.send([null, wsError]);
					}
				}
			);

			wsClient.wsSend(request);
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeInstanceRestart.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.instance.restart", EDesignRuntimeInstanceRestart);

	function EDesignRuntimeInstanceDelete(config) {
		RED.nodes.createNode(this, config);
		const wsClient = RED.nodes.getNode(config.client);

		if (wsClient) {
			this.status(NODE_STATUS.CONNECTING);

			wsClient.on('opened', (event) => {
				this.status(Object.assign(NODE_STATUS.OPEN, {
					event: "connect",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('erro', (event) => {
				this.status(Object.assign(NODE_STATUS.ERROR, {
					event: "error",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('closed', (event) => {
				this.status(Object.assign(NODE_STATUS.CLOSED, {
					event: "disconnect",
					_session: { type: "websocket", id: event.id }
				}));
			});

		} else {
			this.status(NODE_STATUS.ERROR);
		}

		this.on('input', (msg, nodeSend, nodeDone) => {

			const instanceUUID = msg.instanceUUID ?? config['instanceUUID'] ?? undefined;
			const request = new WDXSchema.WDX.Schema.Message.Instance.DeleteRequest(
				instanceUUID,
			);

			const subscription = wsClient.wsMessages().subscribe(
				{
					next: (wsMessage) => {
						if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.InstanceDeleteResponse
							&& wsMessage.uuid === request.uuid) {

							if (undefined !== wsMessage.error) {
								msg.payload = wsMessage.error;
								this.send([null, msg]);
							} else {
								msg.payload = wsMessage.body;
								this.send([msg, null, null]);
							}

							subscription.unsubscribe();
						}
					},
					error: (wsError) => {
						console.error("EDesignRuntimeInstanceRestart.input.wsMessages.error", wsError);
						subscription.unsubscribe();
						this.send([null, wsError]);
					}
				}
			);

			wsClient.wsSend(request);
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeInstanceRestart.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.instance.delete", EDesignRuntimeInstanceDelete);

	function EDesignRuntimeInstanceSubscribeMonitor(config) {

		RED.nodes.createNode(this, config);

		const wsClient = RED.nodes.getNode(config.client);

		if (wsClient) {
			this.status(NODE_STATUS.CONNECTING);

			wsClient.on('opened', (event) => {
				this.status(Object.assign(NODE_STATUS.OPEN, {
					event: "connect",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('erro', (event) => {
				this.status(Object.assign(NODE_STATUS.ERROR, {
					event: "error",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('closed', (event) => {
				this.status(Object.assign(NODE_STATUS.CLOSED, {
					event: "disconnect",
					_session: { type: "websocket", id: event.id }
				}));
			});

		} else {
			this.status(NODE_STATUS.ERROR);
		}

		this.on('input', (msg, nodeSend, nodeDone) => {

			console.debug('EDesignRuntimeInstanceSubscribeMonitor.input', msg);

			if (true === msg.subscribe) {

				console.debug('EDesignRuntimeInstanceSubscribeMonitor.subscribe',);

				if (undefined === this.subscription || true === this.subscription.closed) {

					const request = new WDXSchema.WDX.Schema.Message.Runtime.MonitorSubscribeRequest();

					this.subscription = wsClient.wsMessages().subscribe(
						{
							next: (wsMessage) => {
								if ((wsMessage.type === WDXSchema.WDX.Schema.Message.Type.RuntimeMonitorSubscribeResponse
									&& wsMessage.uuid === request.uuid)
									|| wsMessage.type === WDXSchema.WDX.Schema.Message.Type.RuntimeMonitor) {

									console.debug('EDesignRuntimeInstanceSubscribeMonitor.subscription.next', wsMessage);

									msg.topic = wsMessage.topic;

									if (undefined !== wsMessage.error) {
										msg.payload = wsMessage.error;
										this.send([null, msg]);
									} else {
										msg.payload = wsMessage.body;

										this.status(
											{ fill: "green", shape: "ring", text: "Open - Subscribed" },
										);

										this.send([msg, null, null,]);
									}
								}
							},

							error: (subscribtionError) => {
								console.error("EDesignRuntimeInstanceSubscribeMonitor.input.subscribtion.error", subscribtionError);
								msg.payload = subscribtionError;
								this.send([null, msg]);
							},

							complete: () => {
								console.debug("EDesignRuntimeInstanceSubscribeMonitor.input.subscribtion.complete",);
								this.status(NODE_STATUS.OPEN);
								msg.payload = "complete";
								this.send([null, null, msg]);
							}
						}
					);

					wsClient.wsSend(request);
				}

			} else if (undefined !== this.subscription && false === this.subscription.closed) {
				console.debug('EDesignRuntimeInstanceSubscribeMonitor.input.unsubscribe');
				this.subscription.unsubscribe();
				this.status(NODE_STATUS.OPEN);
				msg.payload = "complete";
				this.send([null, null, msg]);
			}

		});

		this.on('close', () => {
			//console.log("EDesignRuntimeInstanceSubscribeMonitor.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.instance.monitor", EDesignRuntimeInstanceSubscribeMonitor,);

	function EDesignRuntimeInstanceUnsubscribeMonitor(config) {
		RED.nodes.createNode(this, config);

		const wsClient = RED.nodes.getNode(config.client);

		if (wsClient) {
			this.status(NODE_STATUS.CONNECTING);

			wsClient.on('opened', (event) => {
				this.status(Object.assign(NODE_STATUS.OPEN, {
					event: "connect",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('erro', (event) => {
				this.status(Object.assign(NODE_STATUS.ERROR, {
					event: "error",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('closed', (event) => {
				this.status(Object.assign(NODE_STATUS.CLOSED, {
					event: "disconnect",
					_session: { type: "websocket", id: event.id }
				}));
			});

		} else {
			this.status(NODE_STATUS.ERROR);
		}


		this.on('input', (msg, nodeSend, nodeDone) => {

			const request = new WDXSchema.WDX.Schema.Message.Runtime.MonitorUnsubscribeRequest();
			const subscription = wsClient.wsMessages().subscribe(
				{
					next: (wsMessage) => {
						if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.RuntimeMonitorUnsubscribeResponse
							&& wsMessage.uuid === request.uuid) {
							if (undefined !== wsMessage.error) {
								this.send([null, wsMessage.error]);
							} else {
								this.send(wsMessage);
							}
						}
					},
					error: (wsError) => {
						console.error("EDesignRuntimeInstanceSubscribeMonitor.input.wsMessages.error", wsError);
						this.send([null, wsError]);
					}
				}
			);

			wsClient.wsSend(request);
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeInstanceSubscribeMonitor.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.instance.unsubscribe-monitor", EDesignRuntimeInstanceUnsubscribeMonitor,);

	function EDesignRuntimeInstanceSubscribeLog(config) {
		RED.nodes.createNode(this, config);

		const wsClient = RED.nodes.getNode(config.client);

		if (wsClient) {
			this.status(NODE_STATUS.CONNECTING);

			wsClient.on('opened', (event) => {
				this.status(Object.assign(NODE_STATUS.OPEN, {
					event: "connect",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('erro', (event) => {
				this.status(Object.assign(NODE_STATUS.ERROR, {
					event: "error",
					_session: { type: "websocket", id: event.id }
				}));
			});

			wsClient.on('closed', (event) => {
				this.status(Object.assign(NODE_STATUS.CLOSED, {
					event: "disconnect",
					_session: { type: "websocket", id: event.id }
				}));
			});

		} else {
			this.status(NODE_STATUS.ERROR);
		}


		this.on('input', (msg, nodeSend, nodeDone) => {

			console.debug('EDesignRuntimeInstanceSubscribeLog.input', msg);

			const instanceUUID = msg.instanceUUID ?? config['instanceUUID'] ?? undefined;
			if (undefined === instanceUUID) {
				return;
			}

			if (true === msg.subscribe) {

				console.debug('EDesignRuntimeInstanceSubscribeLog.subscribe',);

				if (undefined === this.subscription || true === this.subscription.closed) {

					const request = new WDXSchema.WDX.Schema.Message.Instance.LogSubscribeRequestMessage(instanceUUID);

					this.subscription = wsClient.wsMessages().subscribe(
						{
							next: (wsMessage) => {
								if ((wsMessage.type === WDXSchema.WDX.Schema.Message.Type.InstanceLogSubscribeResponse
									&& wsMessage.uuid === request.uuid) || wsMessage.type === WDXSchema.WDX.Schema.Message.Type.InstanceLog) {

									console.debug('EDesignRuntimeInstanceSubscribeLog.subscription.next', wsMessage);
									msg.topic = wsMessage.topic;

									if (undefined !== wsMessage.error) {
										msg.payload = wsMessage.error;
										this.send([null, msg, null]);
									} else {
										msg.payload = wsMessage.body;

										this.status(
											{ fill: "green", shape: "ring", text: "Open - Subscribed" },
										);

										this.send([msg, null, null,]);
									}
								}
							},

							error: (subscribtionError) => {
								console.error("EDesignRuntimeInstanceSubscribeLog.input.wsMessages.error", subscribtionError);
								msg.payload = subscribtionError;

								this.send([null, msg]);
							},

							complete: () => {
								console.debug("EDesignRuntimeInstanceSubscribeLog.input.subscribtion.complete",);
								this.status(NODE_STATUS.OPEN);
								msg.payload = "complete";
								this.send([null, null, msg]);
							}
						}
					);

					wsClient.wsSend(request);
				}

			} else if (undefined !== this.subscription && false === this.subscription.closed) {
				console.debug('EDesignRuntimeInstanceSubscribeLog.unsubscribe');
				this.subscription.unsubscribe();
				this.status(NODE_STATUS.OPEN);
				msg.payload = "complete";
				this.send([null, null, msg]);;
			}
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeInstanceRestart.close");
			this.status(NODE_STATUS.OPEN);
		});
	}
	RED.nodes.registerType("wago.wdx.instance.monitor-log", EDesignRuntimeInstanceSubscribeLog,);

	function EDesignRuntimeInstanceUnsubscribeLog(config) {

	}
	RED.nodes.registerType("wago.wdx.instance.unsubscribe-log", EDesignRuntimeInstanceUnsubscribeLog,);
}