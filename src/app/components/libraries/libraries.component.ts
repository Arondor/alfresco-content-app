/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NodesApiService, UserPreferencesService } from '@alfresco/adf-core';
import { ShareDataRow } from '@alfresco/adf-content-services';

import { PageComponent } from '../page.component';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';

@Component({
    templateUrl: './libraries.component.html'
})
export class LibrariesComponent extends PageComponent {

    constructor(private nodesApi: NodesApiService,
                route: ActivatedRoute,
                store: Store<AppStore>,
                private router: Router,
                preferences: UserPreferencesService) {
        super(preferences, route, store);
    }

    makeLibraryTooltip(library: any): string {
        const { description, title } = library;

        return description || title || '';
    }

    makeLibraryTitle(library: any): string {
        const rows = this.documentList.data.getRows();
        const entries  = rows.map((r: ShareDataRow) => r.node.entry);
        const { title, id } = library;

        let isDuplicate = false;

        if (entries) {
            isDuplicate = entries
                .some((entry: any) => {
                    return (entry.id !== id && entry.title === title);
                });
        }

        return isDuplicate ? `${title} (${id})` : `${title}`;
    }

    onNodeDoubleClick(e: CustomEvent) {
        const node: any = e.detail.node.entry;

        if (node && node.guid) {
            this.navigate(node.guid);
        }
    }

    navigate(libraryId: string) {
        if (libraryId) {
            this.nodesApi
                .getNode(libraryId, { relativePath: '/documentLibrary' })
                .subscribe(documentLibrary => {
                    this.router.navigate([ './', documentLibrary.id ], { relativeTo: this.route });
                });
        }
    }
}
