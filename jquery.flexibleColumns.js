/**
 * jquery.flexibleColumns.js
 * 
 * This plugin shows a specified number of columns in an HTML table that should be visible
 * at a time after fixing a few columns. The rest of the columns are toggled by clicking
 * previous and next buttons.
 * 
 * @author Mayank K Rastogi
 */
(function($) {
	$.fn.flexibleColumns = initFlexibleColumns;

	// Default settings for the plugin
	$.fn.flexibleColumns.defaults = {
		// Specifies the number of columns that should always be displayed
		fixedColumns: 0,
		// Specifies the number of columns that should be displayed apart
		// from the fixed columns; Leaving it null displays all the columns
		visibleColumns: null,
		// The prefix of the class name that is added to each column of the table
		classPrefix: 'flexibleColumns',
		// The selector for the element acting as previous button
		prevButtonSelector: '.flexibleColumns-button-prev',
		// The selector for the element acting as next button
		nextButtonSelector: '.flexibleColumns-button-next'
	};

	// Plugin function
	function initFlexibleColumns(options) {
		// Merge user-defined settings with default settings
		var settings = $.extend({}, $.fn.flexibleColumns.defaults, options);

		// Acts as a marker to keep track of hidden columns
		var offset = 0;
		// Stores the total number of flexible columns in the table
		var flexibleColumns = 0;

		// Throw an error if jquery.stylesheet plugin is not found
		if (!$.stylesheet) {
			console.log("jQuery stylesheet plugin was not found.");
			return this;
		}

		// Add classes to each <td> or <th> element that can be shown/hidden
		$('tr', this).each(function(rowIndex, row) {
			$('td, th', row).each(function(colIndex, column) {
				// Add class to a <td> or <th> only if it's not a fixed column
				if (colIndex >= settings.fixedColumns) {
					// Calculate the flexible column number
					var columnNumber = colIndex - settings.fixedColumns + 1;
					$(column).addClass(settings.classPrefix + '-col-' + columnNumber);
					// Update the counter for flexible columns if required
					if (flexibleColumns < columnNumber)
						flexibleColumns = columnNumber;
				}
			});
		});

		// If visible columns is not specified, all the columns should be displayed
		if (!settings.visibleColumns)
			settings.visibleColumns = flexibleColumns;
		// Hide the columns that should not be visible initially based on the specified settings
		toggleColumns();

		// Behaviour when previous button is pressed
		$(settings.prevButtonSelector).click(function() {
			// Ignore the click if the first flexible column is already visible
			if (offset > 0) {
				offset--;
				toggleColumns();
			}
			return false;
		});

		// Behaviour when next button is pressed
		$(settings.nextButtonSelector).click(function() {
			// Ignore the click if the last flexible column is already visible
			if (offset + settings.visibleColumns < flexibleColumns) {
				offset++;
				toggleColumns();
			}
			return false;
		});

		/**
		 * Takes care of hiding and showing flexible columns
		 */
		function toggleColumns() {
			// Hide the flexible columns before the offset marker
			for (var i = 0; i < offset; i++) {
				$.stylesheet('.' + settings.classPrefix + '-col-' + (i + 1), 'display', 'none');
			}
			// Show the flexible columns starting from the offset marker
			// till the number of flexible columns that should be visible at a time
			for (var i = offset; i < offset + settings.visibleColumns; i++) {
				$.stylesheet('.' + settings.classPrefix + '-col-' + (i + 1), 'display', '');
			}

			// Hide the flexible columns that should remain hidden
			for (var i = offset + settings.visibleColumns; i < flexibleColumns; i++) {
				$.stylesheet('.' + settings.classPrefix + '-col-' + (i + 1), 'display', 'none');
			}
		}
	}
}(jQuery));
