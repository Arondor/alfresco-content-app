/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { RuleContext } from '@alfresco/adf-extensions';
import { ArenderService } from '../services/arender.service';

export interface ARenderContext extends RuleContext {
  appConfig: {
    config: {
      arender: {
        allowedGroups: string[];
      };
    };
  };
}

/**
 * Checks if user can compare selected file.
 * JSON ref: `app.selection.canCompareFile`
 */
export function canCompareFile(context: RuleContext): boolean {
  if (context.selection.count === 2) {
    return true;
  }
  return false;
}

export class ArenderRules {
  constructor(public arenderService: ArenderService) {}
}

export function isARenderGroupMember(context: ARenderContext): boolean {
  const group = [];
  let selectionContainsSitePermissions = false;
  for (let j = 0; j < context.selection.nodes.length; j++) {
    if (context.selection.nodes[j].entry.permissions) {
      for (let i = 0; i < context.selection.nodes[j].entry.permissions.inherited.length; i++) {
        // Check for a site permissions, may be a document outside a site
        if (context.selection.nodes[j].entry.permissions.inherited[i].authorityId.startsWith('GROUP_site')) {
          selectionContainsSitePermissions = true;
        }
        // Match role from user with role from the document
        if (
          context.profile.groups.find(function (element) {
            // Retrieve group site roles only
            return element.id.startsWith('GROUP_site') && element.id === context.selection.nodes[j].entry.permissions.inherited[i].authorityId;
          })
        ) {
          group.push(context.selection.nodes[j].entry.permissions.inherited[i].name);
        }
      }
    }
  }

  // No permissions, not a document from a site, open in ARender is allowed
  if (!selectionContainsSitePermissions) {
    return true;
  }

  const arenderGroups = context.appConfig.config.arender.allowedGroups;
  if (arenderGroups.length > 0) {
    for (const g of group) {
      if (arenderGroups.indexOf(g) > -1) {
        return true;
      }
    }
  } else {
    return true;
  }
  return false;
}

/**
 * Checks if user can open selected file.
 * JSON ref: `app.selection.canOpenFile`
 */
export function canOpenFile(context: RuleContext): boolean {
  //const library = context.selection.library;
  console.log(context);
  console.log(context.profile.groups);
  console.log(context.profile.initials);
  console.log(context.permissions);

  if (context.selection.library) {
    return false;
  }

  console.log('test 10');
  console.log(context.getEvaluator('test'));

  const group = [];

  for (let j = 0; j < context.selection.nodes.length; j++) {
    for (let i = 0; i < context.selection.nodes[j].entry.permissions.inherited.length; i++) {
      if (
        context.profile.groups.find(function (element) {
          // retrieve group site roles only
          return element.id.startsWith('GROUP_site') && element.id === context.selection.nodes[j].entry.permissions.inherited[i].authorityId;
        })
      ) {
        group.push(context.selection.nodes[j].entry.permissions.inherited[i].name);
      }
    }
  }

  console.log('test555');
  if (group) {
    console.log('test522');
    console.log(group);
  }

  /*var authorizedRoles;
  if (context2.contextMenuActions.find(element => (element.id == "app.arender.window.open")).authorizedRoles){
  authorizedRoles = context2.contextMenuActions.find(element => (element.id == "app.arender.window.open")).authorizedRoles.replace(/\s+/g,"").split(',');
  }
  
  for (var i = 0; i < group.length; i++) {
    if (!authorizedRoles.includes(group[i])) {
    console.log('no');
    return false;
    }
  }*/

  //chrome / js: AppExtensionService
  // ts : RuleContext

  /*for (var i = 0; i < context.selection.nodes.length; i++) {
    //console.log(context.selection.nodes[i].entry.role); //undefined
    console.log(context.selection.nodes[i].entry.properties);
    console.log(context.selection.nodes[i].entry.content);
    console.log(context.selection.nodes[i].entry.permissions);
  }*/

  /*for (var i = 0; i < context.selection.nodes.length; i++) {
    console.log(context.selection.nodes[i].entry.role); //undefined
  }*/

  return true;
}
