var AutoStyler = require('./auto-styler');
var _ = require('underscore');
var HistogramAutoStyler = AutoStyler.extend({
  getStyle: function () {
    var preservedWidth = this.getPreservedWidth();
    var style = '';
    var colors = ['YlGnBu', 'Greens', 'Reds', 'Blues'];
    var color = colors[Math.floor(Math.random() * colors.length)];
    var stylesByGeometry = this.STYLE_TEMPLATE;
    var geometryType = this.layer.getGeometryType();
    if (geometryType) {
      style = this._getHistGeometry(geometryType)
        .replace('{{layername}}', '#layer{');
    } else {
      for (var symbol in stylesByGeometry) {
        style += this._getHistGeometry(symbol)
          .replace('{{layername}}', this._getLayerHeader(symbol));
      }
    }
    if (!_.isEmpty(preservedWidth)) {
      style = style.replace('{{markerWidth}}', preservedWidth);
    } else {
      style = style.replace('{{markerWidth}}', 7);
    }
    return style.replace(/{{column}}/g, this.dataviewModel.get('column'))
      .replace(/{{bins}}/g, this.dataviewModel.get('bins'))
      .replace(/{{color}}/g, color)
      .replace(/{{min}}/g, 1)
      .replace(/{{max}}/g, 20)
      .replace(/{{ramp}}/g, '')
      .replace(/{{defaultColor}}/g, '#000');
  },

  _getHistGeometry: function (geometryType) {
    var style = this.STYLE_TEMPLATE[geometryType];
    var shape = this.dataviewModel.getDistributionType();
    var palette;
    if (geometryType === 'polygon') {
      if (shape === 'F') {
        palette = 'Sunset3';
        style = style.replace('{{defaultColor}}', 'ramp([{{column}}], cartocolor(' + palette + ', {{bins}})), quantiles');
      } else if (shape === 'L' || shape === 'J') {
        palette = 'Sunset2';
        style = style.replace('{{defaultColor}}', 'ramp([{{column}}], cartocolor(' + palette + ', {{bins}}), headtails)');
      } else if (shape === 'A') {
        palette = 'Geyser';
        style = style.replace('{{defaultColor}}', 'ramp([{{column}}], cartocolor(' + palette + ', {{bins}})), quantiles');
      } else if (shape === 'C' || shape === 'U') {
        palette = 'Emrld1';
        style = style.replace('{{defaultColor}}', 'ramp([{{column}}], cartocolor(' + palette + ', {{bins}}), jenks)');
      } else {
        style = style.replace('{{defaultColor}}', 'ramp([{{column}}], colorbrewer({{color}}, {{bins}}))');
      }
    } else if (geometryType === 'marker') {
      if (shape === 'F') {
        palette = 'RedOr1';
        style = style.replace('{{defaultColor}}', 'ramp([{{column}}], cartocolor(' + palette + ', {{bins}})), quantiles');
      } else if (shape === 'L' || shape === 'J') {
        palette = 'Sunset2';
        style = style.replace('{{defaultColor}}', 'ramp([{{column}}], cartocolor(' + palette + ', {{bins}}), headtails)');
      } else if (shape === 'A') {
        palette = 'Geyser';
        style = style.replace('{{defaultColor}}', 'ramp([{{column}}], cartocolor(' + palette + ', {{bins}})), quantiles)');
      } else if (shape === 'C' || shape === 'U') {
        palette = 'BluYl1';
        style = style.replace('{{defaultColor}}', 'ramp([{{column}}], cartocolor(' + palette + ', {{bins}}), jenks)');
      } else {
        style = style.replace('{{markerWidth}}', 'ramp([{{column}}], {{min}}, {{max}}, {{bins}})');
      }
    } else {
      style = style.replace('{{markerWidth}}', 'ramp([{{column}}], {{min}}, {{max}}, {{bins}})');
    }
    if (palette) this.set('palette', palette);
    return style;
  }
});

module.exports = HistogramAutoStyler;
