'use strict';

const { Driver } = require('homey');

class s11556pcDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('Nibe S-Series driver has been initialized');
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
  //   return [
  //     // Example device data, note that `store` is optional
  //     {
  //       name: 'Nibe S-Series',
  //       data: {
  //         id: 'Nibe S-Series-002',
  //       },
  //     },
  //   ];
  // }

  const discoveryStrategy = this.getDiscoveryStrategy();
  const discoveryResults = discoveryStrategy.getDiscoveryResults();
  const devices = Object.values(discoveryResults).map(discoveryResult => {
    return {
      name: discoveryResult.name,
      data: {
        id: discoveryResult.id,
      },
      settings: {
        address: discoveryResult.address,
      }
    };
  });
  this.log(discoveryResults);
  return devices;

}
}

module.exports = s11556pcDriver;
