package io.github.senanurcodes.patilingo.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.view.View
import android.widget.RemoteViews
import org.json.JSONArray
import kotlin.random.Random

/**
 * PatiLingo Ana Ekran Kelime Widget'ı (Android AppWidgetProvider)
 *
 * - 702 kelimelik res/raw/patilingo_words.json havuzunu çevrimdışı okur.
 * - Her 3 saatte bir otomatik yeni kelimeye geçer.
 * - "🔄 Yeni" butonuna dokununca uygulamayı açmadan ana ekranda yeni kelime gösterir.
 * - Karta dokununca doğrudan PatiLingo uygulamasını açar.
 */
class PatiLingoWordWidget : AppWidgetProvider() {

    companion object {
        const val ACTION_NEXT_WORD = "io.github.senanurcodes.patilingo.ACTION_NEXT_WORD"
        private const val PREFS_NAME = "patilingo_widget_prefs"
        private const val KEY_INDEX = "current_word_index"
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        val nextIdx = pickRandomIndex(context)
        for (appWidgetId in appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId, nextIdx)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == ACTION_NEXT_WORD) {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val componentName = ComponentName(context, PatiLingoWordWidget::class.java)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)
            val nextIdx = pickRandomIndex(context)
            for (id in appWidgetIds) {
                updateWidget(context, appWidgetManager, id, nextIdx)
            }
        }
    }

    private fun loadWords(context: Context): JSONArray {
        return try {
            val resId = context.resources.getIdentifier("patilingo_words", "raw", context.packageName)
            if (resId == 0) return JSONArray()
            val text = context.resources.openRawResource(resId).bufferedReader().use { it.readText() }
            JSONArray(text)
        } catch (e: Exception) {
            JSONArray()
        }
    }

    private fun pickRandomIndex(context: Context): Int {
        val words = loadWords(context)
        if (words.length() <= 1) return 0
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val prev = prefs.getInt(KEY_INDEX, -1)
        var next = Random.nextInt(words.length())
        if (next == prev) next = (next + 1) % words.length()
        prefs.edit().putInt(KEY_INDEX, next).apply()
        return next
    }

    private fun updateWidget(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetId: Int,
        wordIndex: Int
    ) {
        val layoutId = context.resources.getIdentifier("widget_patilingo_word", "layout", context.packageName)
        if (layoutId == 0) return
        val views = RemoteViews(context.packageName, layoutId)

        val words = loadWords(context)
        if (words.length() > 0) {
            val safeIdx = wordIndex.coerceIn(0, words.length() - 1)
            val w = words.getJSONObject(safeIdx)
            val en = w.optString("en", "hello")
            val tr = w.optString("tr", "merhaba")
            val emoji = w.optString("emoji", "🐾")
            val level = w.optString("level", "A1")
            val exEn = w.optString("exEn", "")
            val exTr = w.optString("exTr", "")

            val idEmoji = context.resources.getIdentifier("widget_emoji", "id", context.packageName)
            val idEn = context.resources.getIdentifier("widget_word_en", "id", context.packageName)
            val idTr = context.resources.getIdentifier("widget_word_tr", "id", context.packageName)
            val idLevel = context.resources.getIdentifier("widget_level", "id", context.packageName)
            val idExWrap = context.resources.getIdentifier("widget_example_wrap", "id", context.packageName)
            val idExEn = context.resources.getIdentifier("widget_ex_en", "id", context.packageName)
            val idExTr = context.resources.getIdentifier("widget_ex_tr", "id", context.packageName)

            if (idEmoji != 0) views.setTextViewText(idEmoji, emoji)
            if (idEn != 0) views.setTextViewText(idEn, en)
            if (idTr != 0) views.setTextViewText(idTr, tr)
            if (idLevel != 0) views.setTextViewText(idLevel, level)

            if (idExWrap != 0) {
                if (exEn.isNotBlank()) {
                    views.setViewVisibility(idExWrap, View.VISIBLE)
                    if (idExEn != 0) views.setTextViewText(idExEn, exEn)
                    if (idExTr != 0) views.setTextViewText(idExTr, exTr)
                } else {
                    views.setViewVisibility(idExWrap, View.GONE)
                }
            }
        }

        // "🔄 Yeni" butonu tıklaması -> Ana ekranda anında yeni kelime
        val nextIntent = Intent(context, PatiLingoWordWidget::class.java).apply {
            action = ACTION_NEXT_WORD
        }
        val nextPending = PendingIntent.getBroadcast(
            context,
            0,
            nextIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val idNextBtn = context.resources.getIdentifier("widget_next_btn", "id", context.packageName)
        if (idNextBtn != 0) {
            views.setOnClickPendingIntent(idNextBtn, nextPending)
        }

        // Karta tıklama -> PatiLingo uygulamasını aç
        val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
        if (launchIntent != null) {
            val openPending = PendingIntent.getActivity(
                context,
                1,
                launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            val idRoot = context.resources.getIdentifier("widget_root", "id", context.packageName)
            if (idRoot != 0) {
                views.setOnClickPendingIntent(idRoot, openPending)
            }
        }

        appWidgetManager.updateAppWidget(appWidgetId, views)
    }
}
