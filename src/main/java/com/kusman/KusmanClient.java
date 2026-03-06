package com.kusman;
import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;
import net.minecraft.client.MinecraftClient;
import net.minecraft.text.Text;

public class KusmanClient implements ClientModInitializer {
    public static boolean xray = false, aura = false, fly = false;
        @Override public void onInitializeClient() {
                ClientTickEvents.END_CLIENT_TICK.register(client -> {
                            if (client.player == null) return;
                                        if (fly) client.player.getAbilities().flying = true;
                                                    else if (!client.player.isCreative()) client.player.getAbilities().flying = false;
                                                            });
                                                                }
                                                                    public static void exec(String msg) {
                                                                            MinecraftClient mc = MinecraftClient.getInstance();
                                                                                    if (msg.equals(".xray")) { xray = !xray; mc.worldRenderer.reload(); }
                                                                                            else if (msg.equals(".fly")) fly = !fly;
                                                                                                    mc.player.sendMessage(Text.literal("§6[K] §f" + msg.substring(1).toUpperCase() + ": " + (xray||fly ? "§aON" : "§cOFF")), false);
                                                                                                        }
                                                                                                        }