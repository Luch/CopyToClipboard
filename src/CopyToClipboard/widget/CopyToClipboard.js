/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console */
/*mendix */
/*
    CopyToClipboard
    ========================

    @file      : CopyToClipboard.js
    @version   : 1.0
    @author    : Luch Klooster
    @date      : 11-04-2015
    @copyright : FraternIT BV
    @license   : Apache 2

    Documentation
    ========================
    
*/
// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
require({
    packages: [{ name: 'jquery', location: '../../widgets/CopyToClipboard/lib', main: 'jquery-1.11.2.min' },
			   { name: 'zeroclipboard', location: '../../widgets/CopyToClipboard/lib', main: 'zeroclipboard.min' }]
}, [
    'dojo/_base/declare', 'mxui/widget/_WidgetBase', 'dijit/_TemplatedMixin',
    'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-geometry', 'dojo/dom-class', 'dojo/dom-style', 'dojo/dom-construct', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/text',
    'jquery', 'zeroclipboard'
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, domQuery, domProp, domGeom, domClass, domStyle, domConstruct, dojoArray, lang, text, $, ZeroClipboard) {
    'use strict';
    
    // Declare widget's prototype.
    return declare('CopyToClipboard.widget.CopyToClipboard', [ _WidgetBase ], {

        // Parameters configured in the Modeler.
        elementnameString: "",
		buttoncaption: "",
		buttonimage: "",
		buttontooltip: "",
		buttonclass: "",
		buttonstyle: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handle: null,
        _contextObj: null,
        _objProperty: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
			this._objProperty = {};
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            console.log(this.id + '.postCreate');
			var zcbwidget = $("#" + this.id);
			// find element to copy from
			var elementName = '.mx-name-' + this.elementnameString;
			// get id of element
			var elementId = $(elementName).attr('id');
			var element = $(elementName);
			element.addClass('CopyToClipboard_clip_area');
			// attach copy button to widget
			var zcbbuttonid = elementId + '_clip_button';
			// compose button html
			var buttonhtml = '<button type="button" class="btn mx-button btn-default CopyToClipboard_clip_button ' + this.buttonclass + '" id=' + zcbbuttonid;
			// tooltip
			if (this.buttontooltip !== "") 
				{buttonhtml = buttonhtml + ' title="' + this.buttontooltip + '"'};
			// style
			if (this.buttonstyle !== "") 
				{buttonhtml = buttonhtml + ' style="' + this.buttonstyle + '"'};
			buttonhtml = buttonhtml + ' >';
			// buttonimage
			if (this.buttonimage !== "") 
				{buttonhtml = buttonhtml + '<img src='+ this.buttonimage + ' /> '};
			buttonhtml = buttonhtml + this.buttoncaption + '</button>';
			zcbwidget.append(buttonhtml);
			zcbbuttonid = '#' + zcbbuttonid;

			// initiate ZeroClipboard
			var clip = new ZeroClipboard($(zcbbuttonid), {swfPath: "CopyToClipboard/lib"} );
 
			clip.on("ready", function(event) {
				console.log("Flash movie loaded and ready.");
				
				clip.on("copy", function(event) {
					//console.log("Copy");
					event.clipboardData.setData('text/plain', $(elementName + " input").val());
					event.clipboardData.setData('text/plain', $(elementName + " textarea").val());
					event.clipboardData.setData('text/plain', $(elementName + " select :selected" ).text());
				});

				clip.on("aftercopy", function(event) {
					console.log("Copied text to clipboard: " + event.data["text/plain"]);
				});
			});

			clip.on("error", function(event) {
				console.log('CopyToClipboard error of type "' + event.name + '": ' + event.message);
				ZeroClipboard.destroy();
			});
			
            this._setupEvents();
        },
		
        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + '.update');

            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering();

            callback();
        },
		
        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {

        },

        // mxui.widget._WidgetBase.disable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {

        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {

        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        _setupEvents: function () {
			console.log(this.id + '._setupEvents');
        },

        _updateRendering: function () {
            
        },

        _resetSubscriptions: function () {
            // Release handle on previous object, if any.
            if (this._handle) {
                this.unsubscribe(this._handle);
                this._handle = null;
            }

            if (this._contextObj) {
                this._handle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: this._updateRendering
                });
				
				//subscribe to changes in object attribute by other widgets
				this._handle = this.subscribe({
					guid: this._contextObj.getGuid(),
					callback : function(guid, attr, value) {
					}
				});
            }
        }
    });
});
