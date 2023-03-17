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

import { Component, ViewEncapsulation, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfigService, AuthenticationService, EcmUserService, AlfrescoApiService, LogService, NodesApiService } from '@alfresco/adf-core';
import { MinimalNodeEntryEntity } from '@alfresco/js-api/src/api-legacy/legacy';
import { WebscriptApi } from '@alfresco/js-api';

@Component({
  selector: 'arender-viewer',
  templateUrl: './arender-viewer.component.html',
  styleUrls: ['./arender-viewer.component.scss'],
  host: { class: 'arender-viewer' },
  encapsulation: ViewEncapsulation.None
})
export class ArenderViewerComponent implements OnInit {
  /** Node Id of the file to load. */
  @Input()
  nodeId: string = null;

  /** If `true` then show the Viewer as a full page over the current content.
   * Otherwise fit inside the parent div.
   */
  @Input()
  overlayMode = false;

  /** Hide or show the viewer */
  @Input()
  showViewer = true;

  /** Hide or show the toolbar */
  @Input()
  showToolbar = true;

  /** Toggles before/next navigation. You can use the arrow buttons to navigate
   * between documents in the collection.
   */
  @Input()
  allowNavigate = false;

  /** Toggles the "before" ("<") button. Requires `allowNavigate` to be enabled. */
  @Input()
  canNavigateBefore = true;

  /** Toggles the next (">") button. Requires `allowNavigate` to be enabled. */
  @Input()
  canNavigateNext = true;

  /** Allow the left the sidebar. */
  @Input()
  allowLeftSidebar = false;

  /** Allow the right sidebar. */
  @Input()
  allowRightSidebar = false;

  /** Toggles right sidebar visibility. Requires `allowRightSidebar` to be set to `true`. */
  @Input()
  showRightSidebar = false;

  /** Toggles left sidebar visibility. Requires `allowLeftSidebar` to be set to `true`. */
  @Input()
  showLeftSidebar = false;

  @Input()
  documentBuilderEnabled = false;

  /** Emitted when the viewer is shown or hidden. */
  @Output()
  showViewerChange = new EventEmitter<boolean>();

  /** Emitted when user clicks 'Navigate Before' ("<") button. */
  @Output()
  navigateBefore = new EventEmitter<MouseEvent | KeyboardEvent>();

  /** Emitted when user clicks 'Navigate Next' (">") button. */
  @Output()
  navigateNext = new EventEmitter<MouseEvent | KeyboardEvent>();

  /** Node of the file to load. */
  node: MinimalNodeEntryEntity;

  /** ARender URL. */
  arenderURL: string = null;

  /** Name webscript data of node. */
  name = '/';

  /** Webscript API. */
  webScript: WebscriptApi;

  constructor(
    private apiService: AlfrescoApiService,
    private logService: LogService,
    private appConfig: AppConfigService,
    private authenticationService: AuthenticationService,
    private ecmUserService: EcmUserService,
    private nodeApiService: NodesApiService,
    private sanitizer: DomSanitizer
  ) {
    this.webScript = new WebscriptApi(apiService.getInstance());
  }

  ngOnInit() {
    let alfTicket: string;
    let arenderHost: string;
    let userName: string;
    let versionLabel: string;

    arenderHost = this.appConfig.get<string>('arender.host');

    this.ecmUserService.getCurrentUserInfo().subscribe((u) => {
      userName = u.id;
    });

    // Check authentication service.
    if (this.authenticationService.isOauth()) {
      alfTicket = this.apiService.getInstance().config.ticketEcm;
    } else {
      alfTicket = this.authenticationService.getTicketEcm();
    }

    // If nodeId input is null, retrieve it with legacy MinimalNodeEntryEntity.
    if (this.nodeId == null) {
      this.nodeId = this.node.id;
    }

    // Retrieve node information to build the ARender URL.
    this.nodeApiService.getNode(this.nodeId).subscribe((node) => {
      if (node) {
        this.webScript.executeWebScript('GET', 'api/version', { nodeRef: 'workspace://SpacesStore/' + this.nodeId }, 'alfresco', 's').then(
          (webScriptdata) => {
            versionLabel = webScriptdata[0]['label'];
            this.name = '/' + webScriptdata[0]['name'];
            this.arenderURL = arenderHost + this.buildArenderURLParameters(userName, alfTicket, versionLabel, node.isFolder);
          },
          (error) => {
            this.logService.error('Error' + error);
          }
        );
      }
    });
  }

  /**
   * Build the ARender URL
   * @param userName
   * @param alfTicket
   * @param versionLabel
   * @param isFolder
   */
  buildArenderURLParameters(userName: string, alfTicket: string, versionLabel: string, isFolder: boolean): string {
    let arenderParams: string;

    arenderParams = '?nodeRef=workspace://SpacesStore/' + this.nodeId;
    if (alfTicket != null) {
      arenderParams = arenderParams + '&alf_ticket=' + alfTicket;
    }
    if (versionLabel != null) {
      arenderParams = arenderParams + '&versionLabel=' + versionLabel;
    }
    if (isFolder) {
      arenderParams = arenderParams + '&folder=true';
    }
    arenderParams = arenderParams + '&user=' + userName;
    if (this.documentBuilderEnabled) {
      arenderParams = arenderParams + '&documentbuilder.enabled=true';
    }
    return arenderParams;
  }

  /**
   * Method used to sanitize and to not expose straight url in the view.
   */
  buildSafeURL() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.arenderURL);
  }

  onVisibilityChanged(event: boolean) {
    this.showViewerChange.next(event);
  }
}
