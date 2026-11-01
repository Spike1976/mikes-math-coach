package com.mikesmathcoach;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import java.util.Locale;

public class MainActivity extends Activity {
    private WebView webView;
    private TextToSpeech textToSpeech;
    private volatile String activeUtteranceId = null;
    private long speechSequence = 0;
    private boolean speechReady = false;

    @SuppressLint("SetJavaScriptEnabled")
    @Override protected void onCreate(Bundle state) {
        super.onCreate(state);
        Toast.makeText(this, "Mike Math Coach starting…", Toast.LENGTH_SHORT).show();

        getWindow().setStatusBarColor(Color.rgb(7,17,31));
        getWindow().setNavigationBarColor(Color.rgb(7,17,31));

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);

        textToSpeech = new TextToSpeech(this, new TextToSpeech.OnInitListener() {
            @Override public void onInit(int status) {
                if (status == TextToSpeech.SUCCESS) {
                    speechReady = textToSpeech.setLanguage(Locale.US) != TextToSpeech.LANG_MISSING_DATA;
                    textToSpeech.setSpeechRate(0.90f);
                    textToSpeech.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                        @Override public void onStart(String utteranceId) { }

                        @Override public void onDone(String utteranceId) {
                            notifySpeechFinished(utteranceId);
                        }

                        @Override public void onError(String utteranceId) {
                            notifySpeechFinished(utteranceId);
                        }
                    });
                }
            }
        });

        webView.addJavascriptInterface(new SpeechBridge(), "AndroidSpeech");

        webView.setWebViewClient(new WebViewClient() {
            @Override public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                Toast.makeText(MainActivity.this, "Math Coach loaded", Toast.LENGTH_SHORT).show();
            }

            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("file".equals(uri.getScheme())) return false;
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (Exception ignored) { }
                return true;
            }
        });

        webView.loadUrl("file:///android_asset/index.html");
    }

    private class SpeechBridge {
        @JavascriptInterface public String getAppVersion() {
            try {
                android.content.pm.PackageInfo info = getPackageManager().getPackageInfo(getPackageName(), 0);
                return info.versionName + " (" + info.versionCode + ")";
            } catch (Exception ignored) {
                return "Unavailable";
            }
        }

        @JavascriptInterface public void speak(final String text) {
            runOnUiThread(new Runnable() {
                @Override public void run() {
                    if (textToSpeech != null && speechReady) {
                        String id = "math-" + (++speechSequence);
                        activeUtteranceId = id;
                        int result = textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null, id);
                        if (result == TextToSpeech.ERROR) notifySpeechFinished(id);
                    } else {
                        notifySpeechFinished(null);
                    }
                }
            });
        }

        @JavascriptInterface public void stop() {
            runOnUiThread(new Runnable() {
                @Override public void run() {
                    activeUtteranceId = null;
                    if (textToSpeech != null) textToSpeech.stop();
                    notifySpeechFinished(null);
                }
            });
        }

        @JavascriptInterface public boolean isSpeaking() {
            return textToSpeech != null && textToSpeech.isSpeaking();
        }
    }

    private void notifySpeechFinished(final String utteranceId) {
        if (webView == null) return;
        runOnUiThread(new Runnable() {
            @Override public void run() {
                if (webView != null && (utteranceId == null || utteranceId.equals(activeUtteranceId))) {
                    activeUtteranceId = null;
                    webView.evaluateJavascript(
                        "if(window.onNativeSpeechFinished){window.onNativeSpeechFinished();}",
                        null
                    );
                }
            }
        });
    }

    @Override public void onBackPressed() {
        if (webView != null) webView.evaluateJavascript("home()", null);
        else super.onBackPressed();
    }

    @Override protected void onDestroy() {
        activeUtteranceId = null;
        if (textToSpeech != null) {
            textToSpeech.stop();
            textToSpeech.shutdown();
        }
        if (webView != null) webView.destroy();
        super.onDestroy();
    }
}
