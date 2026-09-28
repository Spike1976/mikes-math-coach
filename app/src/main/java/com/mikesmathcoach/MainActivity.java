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
import java.util.Locale;

public class MainActivity extends Activity {
    private WebView webView;
    private TextToSpeech textToSpeech;

    @SuppressLint("SetJavaScriptEnabled")
    @Override protected void onCreate(Bundle state) {
        super.onCreate(state);
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
                    textToSpeech.setLanguage(Locale.US);
                    textToSpeech.setSpeechRate(0.90f);
                    textToSpeech.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                        @Override public void onStart(String utteranceId) { }

                        @Override public void onDone(String utteranceId) {
                            notifySpeechFinished();
                        }

                        @Override public void onError(String utteranceId) {
                            notifySpeechFinished();
                        }
                    });
                }
            }
        });
        webView.addJavascriptInterface(new SpeechBridge(), "AndroidSpeech");

        webView.setWebViewClient(new WebViewClient() {
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
        @JavascriptInterface public void speak(final String text) {
            runOnUiThread(new Runnable() {
                @Override public void run() {
                    if (textToSpeech != null) {
                        textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null, "math-question");
                    }
                }
            });
        }

        @JavascriptInterface public void stop() {
            runOnUiThread(new Runnable() {
                @Override public void run() {
                    if (textToSpeech != null) textToSpeech.stop();
                    notifySpeechFinished();
                }
            });
        }

        @JavascriptInterface public boolean isSpeaking() {
            return textToSpeech != null && textToSpeech.isSpeaking();
        }
    }

    private void notifySpeechFinished() {
        if (webView == null) return;
        runOnUiThread(new Runnable() {
            @Override public void run() {
                if (webView != null) {
                    webView.evaluateJavascript("if(window.onNativeSpeechFinished){window.onNativeSpeechFinished();}", null);
                }
            }
        });
    }

    @Override public void onBackPressed() {
        if (webView != null) webView.evaluateJavascript("home()", null);
        else super.onBackPressed();
    }

    @Override protected void onDestroy() {
        if (textToSpeech != null) {
            textToSpeech.stop();
            textToSpeech.shutdown();
        }
        if (webView != null) webView.destroy();
        super.onDestroy();
    }
}