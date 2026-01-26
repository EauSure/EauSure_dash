import mqtt from 'mqtt';
import logger from '../utils/logger.js';
import { saveWaterQualityData, createAlert } from './database.js';

let mqttClient: mqtt.MqttClient | null = null;

export const initMQTT = async (): Promise<void> => {
  const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
  const MQTT_USERNAME = process.env.MQTT_USERNAME || '';
  const MQTT_PASSWORD = process.env.MQTT_PASSWORD || '';

  mqttClient = mqtt.connect(MQTT_BROKER, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    clientId: `backend_${Math.random().toString(16).slice(2, 8)}`,
  });

  mqttClient.on('connect', () => {
    logger.info('Connected to MQTT broker');
    
    // Subscribe to ChirpStack topics
    mqttClient?.subscribe('application/+/device/+/event/up', (err) => {
      if (err) {
        logger.error('Failed to subscribe to MQTT topics:', err);
      } else {
        logger.info('Subscribed to LoRaWAN uplink topics');
      }
    });
  });

  mqttClient.on('message', async (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      logger.info(`Received MQTT message on ${topic}`);

      // Parse ChirpStack uplink message
      if (topic.includes('/event/up')) {
        await handleUplinkMessage(payload);
      }
    } catch (error) {
      logger.error('Error processing MQTT message:', error);
    }
  });

  mqttClient.on('error', (error) => {
    logger.error('MQTT error:', error);
  });

  mqttClient.on('close', () => {
    logger.warn('MQTT connection closed');
  });
};

const handleUplinkMessage = async (payload: any): Promise<void> => {
  const deviceId = payload.deviceInfo?.devEui || 'unknown';
  const data = payload.data ? Buffer.from(payload.data, 'base64') : null;

  if (!data) {
    logger.warn('No data in uplink message');
    return;
  }

  // Decode payload (adjust according to your device's data format)
  // Example format: [messageType(1), pH(2), TDS(2), battery(1), accelData(6)]
  const messageType = data.readUInt8(0);

  if (messageType === 0x01) {
    // Regular water quality data
    const ph = data.readUInt16BE(1) / 100; // pH * 100
    const tds = data.readUInt16BE(3); // TDS in ppm
    const battery = data.readUInt8(5); // Battery percentage

    const waterQualityData = {
      deviceId,
      ph,
      tds,
      battery,
      timestamp: new Date().toISOString(),
    };

    await saveWaterQualityData(waterQualityData);
    logger.info(`Water quality data saved: pH=${ph.toFixed(2)}, TDS=${tds}ppm`);
    
    // Check for water quality alerts
    if (ph < 6.5 || ph > 8.5 || tds > 500) {
      const alert = await createAlert({
        type: 'water_quality',
        severity: ph < 6 || ph > 9 || tds > 1000 ? 'critical' : 'warning',
        message: `Qualité d'eau anormale détectée: pH=${ph.toFixed(2)}, TDS=${tds}ppm`,
        deviceId,
      });
      logger.warn(`Water quality alert created: ${alert.message}`);
    }
  } else if (messageType === 0x02) {
    // Fall detection alert
    const alert = await createAlert({
      type: 'fall_detection',
      severity: 'critical',
      message: 'ALERTE CRITIQUE: Chute détectée dans le puits!',
      deviceId,
    });
    logger.warn(`Fall detection alert from device ${deviceId}`);
  }
};

export const getMQTTClient = (): mqtt.MqttClient | null => {
  return mqttClient;
};
