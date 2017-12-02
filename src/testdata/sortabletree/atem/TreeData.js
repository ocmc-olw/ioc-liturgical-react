import React from 'react';

const maxDepth = 5;
const renderDepthTitle = ({ path }) => `Depth: ${path.length}`;

const treeData = [
      {
        title: 'Template',
        subtitle: 'se.m01.d01.ve',
        expanded: true,
        children: [
          {
            title: 'Head',
            subtitle: '',
            children: [
              {
                title: 'Set_Date',
                subtitle: 'month 1 day 1 year 2018',
              },
            ],
          },
      {
        expanded: true,
        title: 'when-name-of-day-is',
        children: [
          {
            expanded: true,
            title: 'Sunday',
            children: [{ title: 'Egg' }],
          },
          {
            expanded: true,
            title: 'Otherwise',
            children: [{ title: 'Egg' }],
          },
        ],
      },
      {
        title: 'Button(s) can be added to the node',
        subtitle:
            'Node info is passed when generating so you can use it in your onClick handler',
      },
      {
        title: 'Show node children by setting `expanded`',
        subtitle: ({ node }) =>
            `expanded: ${node.expanded ? 'true' : 'false'}`,
        children: [
          {
            title: 'Bruce',
            subtitle: ({ node }) =>
                `expanded: ${node.expanded ? 'true' : 'false'}`,
            children: [{ title: 'Bruce Jr.' }, { title: 'Brucette' }],
          },
        ],
      },
      {
        title: 'Advanced',
        subtitle: 'Settings, behavior, etc.',
        children: [
          {
            title: (
                <div>
                  <div
                      style={{
                        backgroundColor: 'gray',
                        display: 'inline-block',
                        borderRadius: 10,
                        color: '#FFF',
                        padding: '0 5px',
                      }}
                  >
                    Any Component
                  </div>
                  &nbsp;can be used for `title`
                </div>
            ),
          },
          {
            expanded: true,
            title: 'Limit nesting with `maxDepth`',
            subtitle: `It's set to ${maxDepth} for this example`,
            children: [
              {
                expanded: true,
                title: renderDepthTitle,
                children: [
                  {
                    expanded: true,
                    title: renderDepthTitle,
                    children: [
                      { title: renderDepthTitle },
                      {
                        title: ({ path }) =>
                            path.length >= maxDepth
                                ? 'This cannot be dragged deeper'
                                : 'This can be dragged deeper',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            title:
                'Disable dragging on a per-node basis with the `canDrag` prop',
            subtitle: 'Or set it to false to disable all dragging.',
            noDragging: true,
          },
          {
            title: 'You cannot give this children',
            subtitle:
                'Dropping is prevented via the `canDrop` API using `nextParent`',
            noChildren: true,
          },
          {
            title:
            'When node contents are really long, it will cause a horizontal scrollbar' +
            ' to appear. Deeply nested elements will also trigger the scrollbar.',
          },
        ],
      },
        ],
      },
    ];

export default { treeData };