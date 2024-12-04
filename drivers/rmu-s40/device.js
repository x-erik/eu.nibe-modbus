'use strict';

const { Device } = require('homey');
const modbus = require('jsmodbus');
const net = require('net');
const socket = new net.Socket();

class rmus40Device extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('RMU S40 has been initialized');

    //await new Promise(r => setTimeout(r, 10000));
    //const device = this.homey.drivers.getDriver('s1155pc').getDevice({id: '06545021027001'});
    //this.log(device);
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('RMU S40 has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('RMU S40 settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('RMU S40 was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('RMU S40 has been deleted');
  }

}

module.exports = rmus40Device;
