'use strict';

const { Driver } = require('homey');

class rmus40Driver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('RMU S40 driver has been initialized');
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    const devices = [
      // Mimic the RMU S40
      {
        name: 'RMU S40',
        data: {
          id: 'rmu-s40-0001',
        },
      },
    ]

    // check first if there is an S-Series heatpump connected
    if (this.homey.drivers.getDriver('s1155pc').getDevices().length > 0) {
      return devices;
    }
    else {
      this.log('No S-Serie heatpump found, connect heatpump first to Homey');
      return[];
    }
  }
}

module.exports = rmus40Driver;
