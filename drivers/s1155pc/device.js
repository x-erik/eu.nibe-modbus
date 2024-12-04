'use strict';

const { clear } = require('console');
const { Device } = require('homey');
const modbus = require('jsmodbus');
const net = require('net');
const socket = new net.Socket();

class s11556pcDevice extends Device {

  onDiscoveryResult(discoveryResult) {
    // Return a truthy value here if the discovery result matches your device.
    return discoveryResult.id === this.getData().id;
  }

  async onDiscoveryAvailable(discoveryResult) {
    // This method will be executed once when the device has been found (onDiscoveryResult returned true)
    this.setAvailable();
    this.log('in onDiscoAvailable, IP =', this.getSettings().address);
    this.log('host =', this.host);
    this.log('discoveryResult = ', discoveryResult.address);
    this.log(discoveryResult);
    this.setSettings({
      address: discoveryResult.address,
    });
  }

  onDiscoveryAddressChanged(discoveryResult) {
    // Update your connection details here, reconnect when the device is offline
    this.log('in onDiscoAddrChange, IP =', this.getSettings().address);
    this.log('discoveryResult = ', discoveryResult.address);
    this.log(discoveryResult);
    this.setSettings({
      address: discoveryResult.address,
    });
  }

  onDiscoveryLastSeenChanged(discoveryResult) {
    // When the device is offline, try to reconnect here
    this.log('in onDiscoLastSeenChanged, IP =', this.getSettings().address)
    this.log('discoveryResult = ', discoveryResult.address);
    this.log(discoveryResult);
    this.setSettings({
      address: discoveryResult.address,
    });
  }

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('s11556pcDevice has been initialized');

    const option = {
      'host': this.getSettings().address,
      'port': '502',
      'unitID': 1,
      'timeout': 5000,
      'autoReconnect': true,
      'logLabel' : 'Nibe S-series',
      'logLevel': 'error',
      'logEnabled': true
    }

    const client = new modbus.client.TCP(socket)
    socket.connect(option)
    socket.on('connect', () => {
      
      this.log('Connected ...');
      if (!this.getAvailable()) {
        this.setAvailable();
      }

      // Start the polling interval
      this.pollingInterval = setInterval(() => {
        

        Promise.all([

            // Read all modbus register we want
            client.readInputRegisters(1, 1),      // BT1 - outside temperature
            client.readInputRegisters(37, 1),     // BT1 - Average outside temperature
            client.readInputRegisters(10, 1),     // BT10 - ground source medium IN
            client.readInputRegisters(11, 1),     // BT11 - ground source medium OUT
            client.readInputRegisters(5, 1),      // BT2 - heating supply
            client.readInputRegisters(7, 1),      // BT3 - heating return
            client.readHoldingRegisters(18, 1),   // Degree minutes ==> Holding register
            client.readInputRegisters(8, 1),      // BT7 - Hot water top
            client.readInputRegisters(9, 1),      // BT6 - Hot water load
            client.readInputRegisters(1017, 1),   // BT2 - calculated supply
            client.readInputRegisters(1102, 1),   // Heating pump % 
            client.readInputRegisters(1104, 1),   // Source pump %
            client.readInputRegisters(1028, 1),   // Priority
            client.readInputRegisters(116, 1),    // RMU S40 temperature
            client.readInputRegisters(1046, 1),   // Compressor frequency
            client.readInputRegisters(2166, 1)    // Energy usage

        ]).then((results) => {
    
            // Extract buffer values from modbus JSON response body
            var temperature_outside = results[0].response._body._valuesAsBuffer;
            var temperature_outside_average = results[1].response._body._valuesAsBuffer;
            var temperature_source_in = results[2].response._body._valuesAsBuffer;
            var temperature_source_out = results[3].response._body._valuesAsBuffer;
            var temperature_heating_supply = results[4].response._body._valuesAsBuffer;
            var temperature_heating_return = results[5].response._body._valuesAsBuffer;
            var degree_minutes = results[6].response._body._valuesAsBuffer;
            var temperature_hot_water_top = results[7].response._body._valuesAsBuffer;
            var temperature_hot_water_load = results[8].response._body._valuesAsBuffer;
            var temperature_calculated_supply = results[9].response._body._valuesAsBuffer;
            var heating_pump = results[10].response._body._valuesAsBuffer;
            var source_pump = results[11].response._body._valuesAsBuffer;
            var priority = results[12].response._body._valuesAsBuffer;
            var rmu_s40_temperature = results[13].response._body._valuesAsBuffer;
            var compressor_frequency = results[14].response._body._valuesAsBuffer;
            var energy_usage = results[15].response._body._valuesAsBuffer;
    
            // Convert HEX to Decimal and divide by the scalefactor
            temperature_outside = temperature_outside.readInt16BE().toString() /10;                         // scale factor is 10
            temperature_outside_average = temperature_outside_average.readInt16BE().toString() / 10;        // scale factor is 10
            temperature_source_in = temperature_source_in.readInt16BE().toString() / 10;                    // scale factor is 10
            temperature_source_out = temperature_source_out.readInt16BE().toString() / 10;                  // scale factor is 10
            temperature_heating_supply = temperature_heating_supply.readInt16BE().toString() / 10;          // scale factor is 10
            temperature_heating_return = temperature_heating_return.readInt16BE().toString() / 10;          // scale factor is 10
            degree_minutes = degree_minutes.readInt16BE().toString() / 10;                                  // scale factor is 10
            temperature_hot_water_top = temperature_hot_water_top.readInt16BE().toString() / 10;            // scale factor is 10
            temperature_hot_water_load = temperature_hot_water_load.readInt16BE().toString() / 10;          // scale factor is 10
            temperature_calculated_supply = temperature_calculated_supply.readInt16BE().toString() / 10;    // scale factor is 10
            heating_pump = heating_pump.readInt16BE().toString() / 1;                                       // scale factor is 1
            source_pump = source_pump.readInt16BE().toString() / 1;                                         // scale factor is 1
            priority = priority.readInt16BE().toString() / 1;                                               // scale factor is 1
            rmu_s40_temperature = rmu_s40_temperature.readInt16BE().toString() / 10;                        // scale factor is 10
            compressor_frequency = compressor_frequency.readInt16BE().toString() / 10;                      // scale factor is 10
            energy_usage = energy_usage.readInt16BE().toString() / 1;                                       // scale factor is 1

            // Translate priority mode to text
            if (priority == 10) {
              priority = "Off"
            }
            else if (priority == 20) {
              priority = "Hot water"
            }
            else if (priority == 30) {
              priority = "Heating"
            }
            else if (priority == 40) {
              priority = "Pool"
            }
            else if (priority == 60) {
              priority = "Cooling"
            }
            else {
              priority = "N/A"
            }

            // log compressor frequency
            this.log('source temp in = ', temperature_source_in)
            this.log('compressor frequency = ', compressor_frequency)

            // Set capabilities values
            this.setCapabilityValue('measure_temperature.outside', temperature_outside);
            this.setCapabilityValue('measure_temperature.outside_avg', temperature_outside_average);
            this.setCapabilityValue('measure_temperature.source_in', temperature_source_in);
            this.setCapabilityValue('measure_temperature.source_out', temperature_source_out);
            this.setCapabilityValue('measure_temperature.heating_supply', temperature_heating_supply);
            this.setCapabilityValue('measure_temperature.heating_return', temperature_heating_return);
            this.setCapabilityValue('measure_temperature.degree_minutes', degree_minutes);
            this.setCapabilityValue('measure_temperature.hot_water_top', temperature_hot_water_top);
            this.setCapabilityValue('measure_temperature.hot_water_load', temperature_hot_water_load);
            this.setCapabilityValue('measure_temperature.calculated_supply', temperature_calculated_supply);
            this.setCapabilityValue('measure_percentage.heating_pump', heating_pump);
            this.setCapabilityValue('measure_percentage.source_pump', source_pump);
            this.setCapabilityValue('measure_string.priority', priority);
            this.setCapabilityValue('measure_frequency.compressor', compressor_frequency);
            this.setCapabilityValue('measure_power', energy_usage);

            // this.log('All values set')

            // Check if RMU S40 is added
            if (this.homey.drivers.getDriver('rmu-s40').getDevices().length > 0) {

              // RMU S40 has a fixed device ID (see RMU S40 driver.js)
              const rmu_s40 = this.homey.drivers.getDriver('rmu-s40').getDevice({id: 'rmu-s40-0001'});
              this.log('RMU S40 is added...');
              rmu_s40.setCapabilityValue('measure_temperature', rmu_s40_temperature);
            }
            else {
              this.log('RMU S40 is NOT added...'); // no RMU S40 not setting values to device
            }

        }).catch((error) => {
            // this.log('=== in catch section 1 ===')
            // this.setUnavailable(error.error);
            this.log(error);
        })

      // Close the polling interval  
      }, 15000)
    })

    // Failure handling
    socket.on('error', (error) => {
      this.log(error);
      this.setUnavailable(error.error);
      socket.end();
    })
    
    // Close socket and retry
    socket.on('close', () => {
      this.log('Failed to connect, retrying in 60 seconds ...');
      
      // check if host changed
      clearInterval(this.pollingInterval);

      setTimeout(() => {
        socket.connect(option);
        this.log('Reconnecting now ...');
      }, 60000)
    })
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('MyDevice has been added');
    clearInterval(this.pollingInterval);
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
    this.log('MyDevice settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('MyDevice was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('MyDevice has been deleted');
    clearInterval(this.pollingInterval);
  }

}

module.exports = s11556pcDevice;
