export default {
  "versions": {
    type: "List",
    props: {
      children: [
        {
          type: "Datagrid",
          props: {
            rowClick: 'view',
            children: [
              {
                type: 'TextField',
                props: {
                  source: 'id'
                }
              },
              {
                type: 'DateField',
                props: {
                  source: 'createdAt'
                }
              },
              {
                type: 'ReferenceField',
                props: {
                  source: 'createdBy',
                  reference: 'apiKeys',
                  queryOptions: {
                    meta: { targetField: 'key' }
                  },

                }
              },
              {
                type: 'TextField',
                props: {
                  source: 'version'
                }
              },
              {
                type: 'TextField',
                props: {
                  source: 'key'
                }
              },
            ]
          }
        }
      ]
    },
  },
  "apiKeys": {
    type: "List",
    props: {
      children: [
        {
          type: "Datagrid",
          props: {
            rowClick: 'view',
            children: [
              {
                type: 'TextField',
                props: {
                  source: 'id'
                }
              },
              {
                type: 'DateField',
                props: {
                  source: 'createdAt'
                }
              },
              {
                type: 'ReferenceField',
                props: {
                  source: 'createdBy',
                  reference: 'users',
                  queryOptions: {
                    meta: { targetField: 'sub' }
                  },

                }
              },
            ]
          }
        }
      ]
    }
  },
};
