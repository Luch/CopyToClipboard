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
    packages: [{ name: 'zeroclipboard', location: '../../widgets/CopyToClipboard/lib', main: 'ZeroClipboard.min' }]
}, [
    'dojo/_base/declare', 'mxui/widget/_WidgetBase', 'dijit/_TemplatedMixin',
	'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-class', 'dojo/dom-style', 'dojo/dom-construct', 'dojo/dom-attr', 'dojo/_base/lang', 'dojo/text', 'dojo/text!CopyToClipboard/widget/template/CopyToClipboard.html',
    'zeroclipboard'
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, domQuery, domClass, domStyle, domConstruct, domAttr, lang, text, widgetTemplate, ZeroClipboard) {
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
        _handles: null,
        _contextObj: null,
		_zeroClipboardButton: null,
		_targetElement: null,
		_targetElementSelector : null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
			this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            
			var buttonImageNode = null;
			this._targetElementSelector = '.mx-name-' + this.elementnameString;
			this._targetElement = domQuery(this._targetElementSelector)[0];
			
			if(this._targetElement) {
				domClass.add(this._targetElement,'CopyToClipboard_clip_area');
			}
			
			// compose button html
			this._zeroClipboardButton = domConstruct.create('button', {
				'type' : 'button',
				'class': 'btn mx-button btn-default CopyToClipboard_clip_button',
				'id': domAttr.get(this._targetElement,'id') + '_clip_button',
				'innerHTML': this.buttoncaption
			});
			domConstruct.place(this._zeroClipboardButton, this.domNode);
			
			// tooltip
			if (this.buttontooltip !== "") {
				domAttr.set(this._zeroClipboardButton, 'title', this.buttontooltip);
			}
			//class
			if(this.buttonclass) {
				domClass.add(this._zeroClipboardButton,this.buttonclass);
			}
			// style
			if (this.buttonstyle !== "") {
				domStyle.set(this._zeroClipboardButton, this.buttonstyle);
			}
			// buttonimage
			if (this.buttonimage !== "") {
				buttonImageNode = domConstruct.create('image', {
					'src' : this.buttonimage
				});
				domConstruct.place(this.buttonImageNode, this._zeroClipboardButton);
			}
			this._initiateZeroClipboard();
		},
		
		_initiateZeroClipboard : function () {
			
			ZeroClipboard.config({ swfPath: '/widgets/CopyToClipboard/lib/ZeroClipboard.swf' });
			var clip = new ZeroClipboard(this._zeroClipboardButton);
 
			clip.on("ready", lang.hitch(this, function(event) {
				console.debug("Flash movie loaded and ready.");
				
				clip.on("copy",  lang.hitch(this, function(event) {
					console.debug("Copy event");
					
					var inputNode, textareaNode = null, selectNode = null; 
					
					inputNode = domQuery(this._targetElementSelector + " input")[0];
					if(inputNode) {
						event.clipboardData.setData('text/plain', inputNode.value);
						return;
					}
					
					textareaNode = domQuery(this._targetElementSelector + " textarea")[0];
					if(textareaNode) {
						event.clipboardData.setData('text/plain', textareaNode.value);
					}
					
					selectNode = domQuery(this._targetElementSelector + " select" )[0];
					if(selectNode) {
						event.clipboardData.setData('text/plain', selectNode.options[selectNode.selectedIndex].text);
					}
				}));

				clip.on("aftercopy", lang.hitch(this, function(event) {
					console.log("Copied text to clipboard: " + event.data["text/plain"]);
				}));
			}));

			clip.on("error", lang.hitch(this, function(event) {
				console.log('CopyToClipboard error of type "' + event.name + '": ' + event.message);
				ZeroClipboard.destroy();
			}));

        },
		
        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            this._contextObj = obj;
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
			ZeroClipboard.destroy();
        }

    });
});
