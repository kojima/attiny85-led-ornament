#include <Adafruit_NeoPixel.h>

#include <avr/interrupt.h>
#include <avr/sleep.h>

#define WAKE_PIN    2 // PB2(INT0): active LOW, ground this pin momentary to wake up
#define WS2812_DATA 3 // Neopixel data line
#define WS2812_VCC  4 // Neopixel power line

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS 1 // Popular NeoPixel ring size

// When setting up the NeoPixel library, we tell it how many pixels,
// and which pin to use to send signals. Note that for older NeoPixel
// strips you might need to change the third parameter -- see the
// strandtest example for more information on possible values.
Adafruit_NeoPixel pixels(NUMPIXELS, WS2812_DATA, NEO_GRB + NEO_KHZ800);

long counter = 0;
int wakeupUnit = 50;

typedef struct rgb {
    int r;
    int g;
    int b;
} Rgb;

typedef struct hsv {
  uint16_t h;
  uint8_t s;
  uint8_t v;
} Hsv;

typedef struct ledColor {
  Rgb rgb;
  Hsv hsv;
} LedColor;

//modified from http://playground.arduino.cc/Learning/arduinoSleepCode

void setup(){
  pinMode(WAKE_PIN, INPUT);        // sets the digital pin as input
  pinMode(WS2812_VCC, OUTPUT);
  digitalWrite(WAKE_PIN, HIGH);
  digitalWrite(WS2812_VCC, HIGH);
  pixels.begin(); // INITIALIZE NeoPixel strip object (REQUIRED)
}


void sleepNow() {
  ADCSRA &= ~_BV(ADEN);                   // trun off the AD converter, ADEN(ADC Enable): 7th bit, identical to ADCSRA &= 01111111;
                                          // this suppresses the large volume of the energy consumption.
  digitalWrite(WS2812_VCC, LOW);
 
  set_sleep_mode(SLEEP_MODE_PWR_DOWN);    // sleep mode is set here
  sleep_enable();                         // enables the sleep bit in the mcucr register so sleep is possible
  attachInterrupt(                        // use interrupt 0 (pin 2) and run function wakeUpNow when pin 2 gets LOW
    digitalPinToInterrupt(WAKE_PIN),
    wakeUpNow,
    LOW
  );
  
  sleep_cpu();                           // here the device is actually put to sleep!!
  
  sleep_disable();                       // first thing after waking from sleep: disable sleep...
  detachInterrupt(                       // disables interrupton pin 2 so the wakeUpNow code will not be executed during normal running time.
    digitalPinToInterrupt(WAKE_PIN)
  );
}

void wakeUpNow(){        // here the interrupt is handled after wakeup
  //execute code here after wake-up before returning to the loop() function
  // timers and code using timers (serial.print and more...) will not work here.
  if (counter % wakeupUnit == 0) {
    digitalWrite(WS2812_VCC, HIGH);
  }
}

void loop(){
  if (counter % wakeupUnit == 0 || counter >= wakeupUnit) {
    handleOnShaked();
    counter = 0;
  }
  counter++;

  sleepNow();                      // sleep function called here
}
