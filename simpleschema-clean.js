Schema = {};

Schema.profile = new SimpleSchema({
    name: {
        type: String,
        label: 'Name',
    },
});

Schema.profileExtensions = new SimpleSchema({
    defaultValue: {
        type: String,
        optional: true,
        defaultValue: 'SomeDefaultValue',
    },
    autoValue: {
        type: String,
        optional: true,
        autoValue: function() {
            return 'SomeAutotValue';
        },
    },
    defaultDate: {
        type: Date,
        optional: true,
        defaultValue: new Date(),
    },
    autoDate: {
        type: Date,
        optional: true,
        autoValue: function() {
            return new Date();
        },
    },
});

Persons = new Mongo.Collection('persons');

Persons.attachSchema(Schema.profile);
Persons.attachSchema(Schema.profileExtensions);

if (Meteor.isClient) {

    AutoForm.hooks({
        ProfileAutoForm: {

            onSubmit: function(doc) {

                this.event.preventDefault();

                var result = '';

                result += 'Before cleaning:\n\n';
                result += EJSON.stringify(doc, {
                    indent: 4
                });

                // https://github.com/aldeed/meteor-autoform#onsubmit
                Persons.simpleSchema().clean(doc);

                result += '\n\nAfter cleaning:\n\n';
                result += EJSON.stringify(doc, {
                    indent: 4
                });

                alert(result);

                this.done();
            },

            onError: function(operation, error, template) {
                console.log(error);
                alert(error);
            },
        }
    });
}