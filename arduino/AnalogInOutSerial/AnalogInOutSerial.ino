const int analogInPin = A0;  // Analog input pin that the potentiometer is attached to
int sensorValue = 0;        // value read from the pot
int lastValue = 0;

void setup() {
    Serial.begin(9600); 
}

void loop() {

    sensorValue = analogRead(analogInPin);            

    if (sensorValue != lastValue) {
        Serial.print("B"); // begin char
        Serial.print(sensorValue);   
        Serial.print("E"); // end char
    } 
    lastValue = sensorValue;    
    
    delay(50);                     
}


