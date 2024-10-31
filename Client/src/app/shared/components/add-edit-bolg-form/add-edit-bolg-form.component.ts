import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// services
import { BlogService } from '../../../core/services/blog.service';

// interfaces
import { IBlogForm } from '../../models/IFormGroup';
import IBlog, { IBlogCredentials } from '../../models/IBlog.entity';
import { ICreateBlogSucessfullAPIResponse, IEditBlogSucessfullAPIResponse, IGetBlogDataByIdSucessfullAPIResponse } from '../../models/IBlogAPISucessResponse';
import { IValidationError } from '../../models/IAPIError';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-bolg-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './add-edit-bolg-form.component.html',
  styleUrl: './add-edit-bolg-form.component.css',
})
export class AddEditBolgFormComponent {
  private blogService: BlogService = inject(BlogService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  bolgId: string | null = null;
  private blogData: IBlog | null = null;

  blogForm: FormGroup<IBlogForm>;
  previewUrl: string | null = null;
  isDragging = false;
  isSubmitting = false;
  tags: string[] = [];
  newTag = '';

  categories = [
    'Technology',
    'Travel',
    'Lifestyle',
    'Food',
    'Health',
    'Business',
    'Entertainment',
    'Science',
  ];

  constructor() {
    this.blogForm = new FormGroup<IBlogForm>({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      category: new FormControl('', [Validators.required]),
      content: new FormControl('', [
        Validators.required,
        Validators.minLength(50),
      ]),
      image: new FormControl(null),
    });

    this.bolgId = this.activatedRoute.snapshot.paramMap.get("blogId");

    this.getBlogData();
  }

  private getBlogData() {
    if(!this.bolgId) return;

    const getBlogDataByIdApiResponse$: Observable<IGetBlogDataByIdSucessfullAPIResponse> = this.blogService.getBlogById(this.bolgId);

    getBlogDataByIdApiResponse$.subscribe({
      next: (res) => {
        this.blogData = res.data;

        this.initForm();
      },
      error: (err) => {
        this.router.navigate(["/myblogs"]);  
      }
    });
  }

  private initForm() {
    if(!this.blogData) {
      this.router.navigate(["/myblogs"]);
      return;
    }
    
    this.urlToFile(this.blogData.image.url);

    this.tags = this.blogData.tags;

    this.blogForm.patchValue({ title: this.blogData.title, category: this.blogData.category, content: this.blogData.content });
  }

  private async urlToFile(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    
    const filename: string = this.getDoumentName(url);

    // Convert blob to File object
    const file: File = new File([blob], filename, { type: this.getContentTypeFromUrl(url)! });

    this.handleFile(file);
  }

  private getContentTypeFromUrl(url: string): string | null {
    const extension = url.split('.').pop()?.toLowerCase(); // Extract the file extension

    if(!extension) {
      this.router.navigate(["/myblogs"]);
      return null;
    }

    // Map of file extensions to MIME types
    const typeMap: { [key: string]: string } = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        svg: "image/svg+xml",
        bmp: "image/bmp",
        webp: "image/webp",
    };

    // Return the corresponding content type or null if not found
    const type = typeMap[extension];

    if(!type) {
      this.router.navigate(["/myblogs"]);
      return null;
    }
    
    return type;
  }

  private getDoumentName(url: string) {
    return decodeURIComponent(url.split("/").pop()!.split("-")!.pop()!)
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  handleFile(file: File): void {
    this.blogForm.get('image')?.setErrors(null);

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
        this.blogForm.patchValue({ image: file });
      };
      reader.readAsDataURL(file);
    } else {
      this.blogForm
        .get('image')
        ?.setErrors({ message: 'Provide a vaild image file' });
    }
  }

  removeImage(): void {
    this.previewUrl = null;
    this.blogForm.patchValue({ image: null });
  }

  addTag(event: Event): void {
    event.preventDefault();

    if (this.newTag.trim() && !this.tags.includes(this.newTag.trim())) {
      this.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
  }

  getWordCount(): number {
    const content = this.blogForm.get('content')?.value || '';
    return content.trim().split(/\s+/).filter(Boolean).length;
  }

  private isImageVaild() {
    this.blogForm.get('image')?.setErrors(null);

    const { image } = this.blogForm.value;

    if (!image) {
      this.blogForm
        .get('image')
        ?.setErrors({ message: 'This Field is required' });
    }
  }

  async onSubmit(): Promise<void> {
    this.isImageVaild();

    if (this.blogForm.invalid || this.isSubmitting)
      return this.blogForm.markAllAsTouched();

    this.isSubmitting = true;

    const blogCredentials: IBlogCredentials = {
      title: this.blogForm.value.title!,
      category: this.blogForm.value.category!,
      content: this.blogForm.value.content!,
      image: this.blogForm.value.image!,
      tags: this.tags,
    };
    

    const formData: FormData = new FormData();

    formData.append('title', blogCredentials.title);
    formData.append('category', blogCredentials.category);
    formData.append('content', blogCredentials.content);
    formData.append('image', blogCredentials.image, blogCredentials.image.name);
    formData.append('tags', JSON.stringify(blogCredentials.tags));

    if(!this.bolgId) {
      const createBlogApiResponse$: Observable<ICreateBlogSucessfullAPIResponse> = this.blogService.createBlog(formData);

      this.subscribeObservable(createBlogApiResponse$);
    }else{
      const editBlogApiResponse$: Observable<IEditBlogSucessfullAPIResponse> = this.blogService.editBlog(formData, this.bolgId!);

      this.subscribeObservable(editBlogApiResponse$);
    }  
  }

  private subscribeObservable(observable$: Observable<ICreateBlogSucessfullAPIResponse | IEditBlogSucessfullAPIResponse>) {
    observable$.subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.blogForm.reset();
        this.tags = [];
        this.previewUrl = null;

        this.router.navigate(['/myblogs']);
      },
      error: (err) => {
        this.isSubmitting = false;

        if (!err.errorField) return;

        const errObj: IValidationError = err as IValidationError;

        this.blogForm
          .get(errObj.errorField)
          ?.setErrors({ message: errObj.message });

        this.blogForm.markAllAsTouched();
      },
    });
  }
}
