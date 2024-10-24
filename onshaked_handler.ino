
// LEDオーナメント点灯パターンプログラム

LedColor led1 = {{0, 0, 0}, {0, 0, 0}};
LedColor led2 = {{0, 0, 0}, {0, 0, 0}};
LedColor led3 = {{0, 0, 0}, {0, 0, 0}};
LedColor led4 = {{0, 0, 0}, {0, 0, 0}};

// 揺さぶられたとき
void handleOnShaked() {
  // 繰り返し 4 回
  for (int i = 0; i < 4; i++) {
    // すべてのLEDを 500 ミリ秒でフェードインする
    led1 = {{187, 28, 212}, {53129, 221, 212}};
    led2 = {{38, 154, 255}, {37852, 217, 255}};
    led3 = {{187, 28, 212}, {53129, 221, 212}};
    led4 = {{38, 154, 255}, {37852, 217, 255}};

    for (int x = 1; x <= 50; x++) {
      float ratio = x / float(50);
      ratio = ratio * ratio;
      pixels.clear();
      pixels.setPixelColor(0, pixels.Color(led1.rgb.r, led1.rgb.g, led1.rgb.b));
      pixels.setPixelColor(1, pixels.Color(led2.rgb.r, led2.rgb.g, led2.rgb.b));
      pixels.setPixelColor(2, pixels.Color(led3.rgb.r, led3.rgb.g, led3.rgb.b));
      pixels.setPixelColor(3, pixels.Color(led4.rgb.r, led4.rgb.g, led4.rgb.b));
      int brightness = floor(255 * ratio);
      pixels.setBrightness(brightness);
      pixels.show();
      delay(10);
    }

    // 一時停止 500 (ミリ秒)
    delay(500);

    // すべてのLEDを 500 ミリ秒でフェードアウトする
    for (int x = 1; x <= 50; x++) {
      float ratio = x / float(50);
      ratio = 1 - (1 - ratio) * (1 - ratio);
      pixels.clear();
      pixels.setPixelColor(0, pixels.Color(led1.rgb.r, led1.rgb.g, led1.rgb.b));
      pixels.setPixelColor(1, pixels.Color(led2.rgb.r, led2.rgb.g, led2.rgb.b));
      pixels.setPixelColor(2, pixels.Color(led3.rgb.r, led3.rgb.g, led3.rgb.b));
      pixels.setPixelColor(3, pixels.Color(led4.rgb.r, led4.rgb.g, led4.rgb.b));
      int brightness = floor(255 * (1 - ratio));
      pixels.setBrightness(brightness);
      pixels.show();
      delay(10);
    }
    led1 = {{0, 0, 0}, {0, 0, 0}};
    led2 = {{0, 0, 0}, {0, 0, 0}};
    led3 = {{0, 0, 0}, {0, 0, 0}};
    led4 = {{0, 0, 0}, {0, 0, 0}};

    // 一時停止 500 (ミリ秒)
    delay(500);

    // すべてのLEDを 500 ミリ秒でフェードインする
    led1 = {{38, 154, 255}, {37852, 217, 255}};
    led2 = {{187, 28, 212}, {53129, 221, 212}};
    led3 = {{38, 154, 255}, {37852, 217, 255}};
    led4 = {{187, 28, 212}, {53129, 221, 212}};

    for (int x = 1; x <= 50; x++) {
      float ratio = x / float(50);
      ratio = ratio * ratio;
      pixels.clear();
      pixels.setPixelColor(0, pixels.Color(led1.rgb.r, led1.rgb.g, led1.rgb.b));
      pixels.setPixelColor(1, pixels.Color(led2.rgb.r, led2.rgb.g, led2.rgb.b));
      pixels.setPixelColor(2, pixels.Color(led3.rgb.r, led3.rgb.g, led3.rgb.b));
      pixels.setPixelColor(3, pixels.Color(led4.rgb.r, led4.rgb.g, led4.rgb.b));
      int brightness = floor(255 * ratio);
      pixels.setBrightness(brightness);
      pixels.show();
      delay(10);
    }

    // 一時停止 500 (ミリ秒)
    delay(500);

    // すべてのLEDを 500 ミリ秒でフェードアウトする
    for (int x = 1; x <= 50; x++) {
      float ratio = x / float(50);
      ratio = 1 - (1 - ratio) * (1 - ratio);
      pixels.clear();
      pixels.setPixelColor(0, pixels.Color(led1.rgb.r, led1.rgb.g, led1.rgb.b));
      pixels.setPixelColor(1, pixels.Color(led2.rgb.r, led2.rgb.g, led2.rgb.b));
      pixels.setPixelColor(2, pixels.Color(led3.rgb.r, led3.rgb.g, led3.rgb.b));
      pixels.setPixelColor(3, pixels.Color(led4.rgb.r, led4.rgb.g, led4.rgb.b));
      int brightness = floor(255 * (1 - ratio));
      pixels.setBrightness(brightness);
      pixels.show();
      delay(10);
    }
    led1 = {{0, 0, 0}, {0, 0, 0}};
    led2 = {{0, 0, 0}, {0, 0, 0}};
    led3 = {{0, 0, 0}, {0, 0, 0}};
    led4 = {{0, 0, 0}, {0, 0, 0}};

    // 一時停止 500 (ミリ秒)
    delay(500);

  }

}
