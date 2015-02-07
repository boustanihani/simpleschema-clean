Schema = {};

Schema.extensions = new SimpleSchema({
    defaultValue: {
        type: String,
        defaultValue: 'SomeDefaultValue',
    },
    autoValue: {
        type: String,
        autoValue: function() {
            return 'SomeAutotValue';
        },
    },
    createdAt: {
        type: Date,
        label: 'Erstellt am',
        index: true,
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {
                    $setOnInsert: new Date()
                };
            } else {
                this.unset(); // => denyUpdate
            }
        }
    }
});

Schema.profile = new SimpleSchema({
    name: {
        type: String,
        label: 'Name',
    },
});

Schema.persons = new SimpleSchema({
    profile: {
        type: Schema.profile,
    }
});

Persons = new Mongo.Collection('persons');

Persons.attachSchema(Schema.persons);
Persons.attachSchema(Schema.extensions);

if (Meteor.isClient) {

    AutoForm.hooks({
        ProfileAutoForm: {

            onSubmit: function(doc) {

                this.event.preventDefault();

                var toBeCleaned = {
                    profile: doc
                };

                var alertMessage = '';

                alertMessage += 'Before cleaning:\n\n';
                alertMessage += EJSON.stringify(toBeCleaned, {
                    indent: 4
                });

                // https://github.com/aldeed/meteor-autoform#onsubmit
                Persons.simpleSchema().clean(toBeCleaned);

                alertMessage += '\n\nAfter cleaning:\n\n';
                alertMessage += EJSON.stringify(toBeCleaned, {
                    indent: 4
                });

                alert(alertMessage);

                this.done();
            },

            onError: function(operation, error, template) {
                console.log(error);
                alert(error);
            },
        }
    });
}