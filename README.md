# Nibe S-Series

Homey app for Nibe S-Series.
Support for Nibe S-Series. Currently only S1155 and RMU-S40 (only temp viewing). Other heatpumps may work as long as modbus registers are the same.
Values are read from Modbus with jsmodbus module.

Following sensors are read throug modbus:
 - BT1 - outside temperature
 - BT1 - Average outside temperature
 - BT10 - ground source medium IN
 - BT11 - ground source medium OUT
 - BT2 - heating supply
 - BT3 - heating return
 - Degree minutes 
 - BT6 - Hot water load
 - BT7 - Hot water top
 - BT2 - calculated supply
 - Heating pump % 
 - Source pump %
 - Priority
 - RMU S40 temperature
 - Compressor frequency
 - Energy usage