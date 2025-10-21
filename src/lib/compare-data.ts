export type ComponentType = 'motor' | 'battery' | 'sensor' | 'microcontroller' | 'esc';

export interface ComponentSpec {
  id: string;
  name: string;
  type: ComponentType;
  manufacturer: string;
  price: string;
  specs: Record<string, string | number>;
}

export const componentData: Record<ComponentType, ComponentSpec[]> = {
  motor: [
    {
      id: 'n20-1000',
      name: 'N20 1000RPM',
      type: 'motor',
      manufacturer: 'Generic',
      price: '$3-5',
      specs: {
        voltage: '6V',
        rpm: 1000,
        torque: '0.3 kg-cm',
        current: '0.15A',
        weight: '10g',
        type: 'Brushed DC',
      },
    },
    {
      id: 'rs775',
      name: 'RS-775',
      type: 'motor',
      manufacturer: 'Johnson Electric',
      price: '$15-20',
      specs: {
        voltage: '12-24V',
        rpm: 15000,
        torque: '1.8 kg-cm',
        current: '3A no-load',
        weight: '290g',
        type: 'Brushed DC',
      },
    },
    {
      id: 'turnigy-sk3-2826',
      name: 'Turnigy SK3 2826',
      type: 'motor',
      manufacturer: 'Turnigy',
      price: '$25',
      specs: {
        voltage: '11.1-14.8V',
        kv: 1130,
        power: '1100W',
        current: '60A max',
        weight: '96g',
        type: 'Brushless',
      },
    },
    {
      id: 'pololu-micro-metal',
      name: 'Pololu Micro Metal 100:1',
      type: 'motor',
      manufacturer: 'Pololu',
      price: '$15',
      specs: {
        voltage: '6V',
        rpm: 320,
        torque: '3 kg-cm',
        current: '0.36A',
        weight: '9.5g',
        type: 'Brushed DC with Gearbox',
      },
    },
  ],
  battery: [
    {
      id: 'turnigy-3s-450',
      name: 'Turnigy 3S 450mAh 75C',
      type: 'battery',
      manufacturer: 'Turnigy',
      price: '$8',
      specs: {
        voltage: '11.1V',
        capacity: '450mAh',
        cRating: '75C',
        maxDischarge: '33.75A',
        weight: '36g',
        chemistry: 'LiPo',
      },
    },
    {
      id: 'turnigy-3s-650',
      name: 'Turnigy 3S 650mAh 75C',
      type: 'battery',
      manufacturer: 'Turnigy',
      price: '$10',
      specs: {
        voltage: '11.1V',
        capacity: '650mAh',
        cRating: '75C',
        maxDischarge: '48.75A',
        weight: '54g',
        chemistry: 'LiPo',
      },
    },
    {
      id: 'sony-vtc6',
      name: 'Sony VTC6 18650',
      type: 'battery',
      manufacturer: 'Sony',
      price: '$8',
      specs: {
        voltage: '3.7V',
        capacity: '3000mAh',
        cRating: '10C',
        maxDischarge: '30A',
        weight: '46g',
        chemistry: 'Li-ion',
      },
    },
    {
      id: 'gens-ace-4s-5000',
      name: 'Gens Ace 4S 5000mAh 50C',
      type: 'battery',
      manufacturer: 'Gens Ace',
      price: '$45',
      specs: {
        voltage: '14.8V',
        capacity: '5000mAh',
        cRating: '50C',
        maxDischarge: '250A',
        weight: '430g',
        chemistry: 'LiPo',
      },
    },
  ],
  sensor: [
    {
      id: 'hc-sr04',
      name: 'HC-SR04 Ultrasonic',
      type: 'sensor',
      manufacturer: 'Generic',
      price: '$2-3',
      specs: {
        range: '2cm - 4m',
        accuracy: '±3mm',
        voltage: '5V',
        current: '15mA',
        interface: 'Trigger/Echo',
        beamAngle: '15°',
      },
    },
    {
      id: 'mpu6050',
      name: 'MPU6050 IMU',
      type: 'sensor',
      manufacturer: 'InvenSense',
      price: '$3-5',
      specs: {
        axes: '6-axis',
        gyroRange: '±250 to ±2000°/s',
        accelRange: '±2 to ±16g',
        voltage: '3-5V',
        interface: 'I2C',
        updateRate: '1kHz',
      },
    },
    {
      id: 'rplidar-a1',
      name: 'RPLIDAR A1',
      type: 'sensor',
      manufacturer: 'Slamtec',
      price: '$99',
      specs: {
        range: '0.15m - 12m',
        scanRate: '5.5Hz',
        resolution: '360°',
        voltage: '5V',
        interface: 'Serial',
        weight: '170g',
      },
    },
    {
      id: 'sharp-gp2y0a21',
      name: 'Sharp GP2Y0A21YK0F',
      type: 'sensor',
      manufacturer: 'Sharp',
      price: '$10',
      specs: {
        range: '10cm - 80cm',
        voltage: '5V',
        output: 'Analog',
        responseTime: '16.5ms',
        current: '30mA',
        type: 'Infrared',
      },
    },
  ],
  microcontroller: [
    {
      id: 'arduino-uno',
      name: 'Arduino Uno R3',
      type: 'microcontroller',
      manufacturer: 'Arduino',
      price: '$25',
      specs: {
        mcu: 'ATmega328P',
        clock: '16MHz',
        flash: '32KB',
        ram: '2KB',
        digitalIO: 14,
        analogInput: 6,
        voltage: '5V',
      },
    },
    {
      id: 'esp32-devkit',
      name: 'ESP32 DevKit',
      type: 'microcontroller',
      manufacturer: 'Espressif',
      price: '$8-10',
      specs: {
        mcu: 'Dual-core Tensilica LX6',
        clock: '240MHz',
        flash: '4MB',
        ram: '520KB',
        digitalIO: 34,
        wifi: 'Yes',
        bluetooth: 'Yes',
        voltage: '3.3V',
      },
    },
    {
      id: 'raspberry-pi-4',
      name: 'Raspberry Pi 4 (4GB)',
      type: 'microcontroller',
      manufacturer: 'Raspberry Pi Foundation',
      price: '$55',
      specs: {
        cpu: 'Quad-core ARM Cortex-A72',
        clock: '1.5GHz',
        ram: '4GB',
        gpio: 40,
        usb: '4 ports',
        ethernet: 'Gigabit',
        wifi: 'Yes',
        os: 'Linux',
      },
    },
    {
      id: 'teensy-4.0',
      name: 'Teensy 4.0',
      type: 'microcontroller',
      manufacturer: 'PJRC',
      price: '$20',
      specs: {
        mcu: 'ARM Cortex-M7',
        clock: '600MHz',
        flash: '2MB',
        ram: '1MB',
        digitalIO: 40,
        voltage: '3.3V',
        usbType: 'USB 2.0',
      },
    },
  ],
  esc: [
    {
      id: 'hobbywing-30a',
      name: 'Hobbywing 30A',
      type: 'esc',
      manufacturer: 'Hobbywing',
      price: '$15',
      specs: {
        continuousCurrent: '30A',
        burstCurrent: '40A',
        voltage: '2-4S LiPo',
        bec: '5V 2A',
        weight: '25g',
        programming: 'Yes',
      },
    },
    {
      id: 'blheli-32-50a',
      name: 'BLHeli_32 50A',
      type: 'esc',
      manufacturer: 'Generic',
      price: '$25',
      specs: {
        continuousCurrent: '50A',
        burstCurrent: '60A',
        voltage: '3-6S LiPo',
        firmware: 'BLHeli_32',
        weight: '31g',
        features: 'Telemetry, Reversible',
      },
    },
    {
      id: 'vesc-75-300',
      name: 'VESC 75V 300A',
      type: 'esc',
      manufacturer: 'Trampa',
      price: '$250',
      specs: {
        continuousCurrent: '300A',
        voltage: '75V max',
        features: 'FOC, CAN Bus, Telemetry',
        programming: 'Full configurability',
        weight: '115g',
        applications: 'E-skate, E-bike, Robots',
      },
    },
  ],
};

export function getComponentsByType(type: ComponentType): ComponentSpec[] {
  return componentData[type] || [];
}

export function getComponentById(id: string): ComponentSpec | undefined {
  for (const type in componentData) {
    const found = componentData[type as ComponentType].find(c => c.id === id);
    if (found) return found;
  }
  return undefined;
}

export function getAllComponentTypes(): ComponentType[] {
  return Object.keys(componentData) as ComponentType[];
}
