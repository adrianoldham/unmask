/* Notes:
 * ------------------------------------------------------------------------
 * passwordFields and toggleElements must match one to one
 * ------------------------------------------------------------------------ 
 */

var Unmask = Class.create({
    initialize: function(passwordFields, toggleElements, options) {
        this.options = Object.extend(Object.extend({ }, this.options), options || { });
        
        this.passwordFields = $$(passwordFields);
        this.toggleElements = $$(toggleElements);
        
        // Setup all the password fields and link the to their toggle elements
        var index = 0;
        this.instances = this.passwordFields.map(function(passwordField) {
            var toggleElement = this.toggleElements[index++];
            return new Unmask.Instance(passwordField, toggleElement, this.options);
        }.bind(this));
    }
});

Unmask.Instance = Class.create({
    options: {
        labelText: "Show password"
    },
    
    initialize: function(passwordField, toggleElement, options) {
        this.options = Object.extend(Object.extend({ }, this.options), options || { });
        
        this.passwordField = $(passwordField);
        this.toggleElement = $(toggleElement);
        
        // Inject toggle element if none specified
        if (this.toggleElement == null) {
            this.createToggleElement();
        }
        
        // Update the mask whenever the checkbox is toggled
        this.toggleElement.observe('change', this.updateMask.bind(this));
        
        // Update the mask before starting (to fix refreshes or back buttons)
        this.updateMask();
    },
    
    createToggleElement: function() {
        this.toggleElement = new Element("input", { type: "checkbox", value: this.options.labelText });
        this.labelElement = new Element("label").update(this.options.labelText);
        
        this.labelElement.insert({ top: this.toggleElement });
        this.passwordField.insert({ after: this.labelElement });
    },
    
    updateMask: function() {
        var checked = this.toggleElement.checked;
        this.newType = checked ? "text" : "password";
        this.passwordField.writeAttribute('type', this.newType);
    }
});