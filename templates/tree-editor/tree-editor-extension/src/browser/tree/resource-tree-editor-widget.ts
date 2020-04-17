/*!
* Copyright (C) 2020 EclipseSource and others.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v. 2.0 which is available at
* http://www.eclipse.org/legal/epl-2.0.
*
* This Source Code may also be made available under the following Secondary
* Licenses when the conditions for such availability set forth in the Eclipse
* Public License v. 2.0 are satisfied: GNU General Public License, version 2
* with the GNU Classpath Exception which is available at
* https://www.gnu.org/software/classpath/license.html.
*
* SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
*/

import { Title, Widget } from '@theia/core/lib/browser';
import { DefaultResourceProvider, Resource } from '@theia/core/lib/common';
import { ILogger } from '@theia/core/lib/common';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import {
  AddCommandProperty,
  JsonFormsTreeEditorWidget,
  JsonFormsTreeWidget,
  JSONFormsWidget,
  NavigatableTreeEditorOptions,
  NavigatableTreeEditorWidget,
  TreeEditor,
} from 'theia-tree-editor';

export class ResourceTreeEditorWidget extends NavigatableTreeEditorWidget {
  protected resource: Resource;
  protected data: any;

  constructor(
    protected readonly treeWidget: JsonFormsTreeWidget,
    protected readonly formWidget: JSONFormsWidget,
    protected readonly workspaceService: WorkspaceService,
    protected readonly logger: ILogger,
    readonly widget_id: string,
    protected readonly options: NavigatableTreeEditorOptions,
    protected readonly provider: DefaultResourceProvider,
  ) {
    super(
      treeWidget,
      formWidget,
      workspaceService,
      logger,
      widget_id,
      options
    );

    const uri = this.options.uri;
    provider.get(uri).then(resource => {
      this.resource = resource
    });
  }



  public save(): void {
    const content = JSON.stringify(this.data);
    this.resource.saveContents(content).then( _ =>
      this.setDirty(true)
    ).catch( _ => 
      this.setDirty(false)
    );
  }

  public load(): void {
    console.log('test');
    this.resource.readContents().then( content => {
      const json = JSON.parse(content);
      this.data = json;
      const treeData: TreeEditor.TreeData = {
        error: false,
        data: json, // json sind die aus der resource geladenen daten
      }
      this.treeWidget.setData(treeData);
    });
  }

  private setDirty(dirty: boolean) {
    this.dirty = dirty;
    this.onDirtyChangedEmitter.fire();
  }


  protected deleteNode(node: Readonly<TreeEditor.Node>): void {
    this.logger.info('Delete data from server');
  }

  protected addNode({ node, type, property }: AddCommandProperty): void {
    this.logger.info('Add data to server');
  }

  protected handleFormUpdate(data: any, node: TreeEditor.Node) {
    this.logger.info('Handle form update');
  }

  protected configureTitle(title: Title<Widget>): void {
    title.label = this.options.uri.path.base;
    title.caption = JsonFormsTreeEditorWidget.WIDGET_LABEL;
    title.closable = true;
    title.iconClass = 'fa tree-icon dark-purple';
  }
}