import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// interfaces
import { IBlogForm } from '../../models/IFormGroup';
import { IBlogCredentials } from '../../models/IBlog.entity';

@Component({
  selector: 'app-create-blog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-blog-form.component.html',
  styleUrl: './create-blog-form.component.css'
})
export class CreateBlogFormComponent {
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
    'Science'
  ];

  constructor() {
    this.blogForm = new FormGroup<IBlogForm>({
      title: new FormControl("", [Validators.required, Validators.minLength(5)]),
      category: new FormControl("", [Validators.required]),
      content: new FormControl("", [Validators.required, Validators.minLength(50)]),
      image: new FormControl(null)
    });
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
    this.blogForm.get("image")?.setErrors(null);

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
        this.blogForm.patchValue({ image: file });
      };
      reader.readAsDataURL(file);
    }else {
      this.blogForm.get("image")?.setErrors({ message: "Provide a vaild image file" });
    }
  }

  removeImage(): void {
    this.previewUrl = null;
    this.blogForm.patchValue({ image: null });
  }

  addTag(): void {
    if (this.newTag.trim() && !this.tags.includes(this.newTag.trim())) {
      this.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  getWordCount(): number {
    const content = this.blogForm.get('content')?.value || '';
    return content.trim().split(/\s+/).filter(Boolean).length;
  }

  private isImageVaild() {
    this.blogForm.get("image")?.setErrors(null);

    const { image } = this.blogForm.value;

    if(!image) {
      this.blogForm.get("image")?.setErrors({ message: "This Field is required" });
    }
  }

  async onSubmit(): Promise<void> {
    this.isImageVaild();

    if(this.blogForm.invalid || this.isSubmitting) return this.blogForm.markAllAsTouched();

      this.isSubmitting = true;

      const blogCredentials: IBlogCredentials = {
        title: this.blogForm.value.title!,
        category: this.blogForm.value.category!,
        content: this.blogForm.value.content!,
        image: this.blogForm.value.image!,
        tags: this.tags
      };

      const formData: FormData = new FormData();

      formData.append("title", blogCredentials.title);
      formData.append("category", blogCredentials.category);
      formData.append("content", blogCredentials.content);
      formData.append("image", blogCredentials.image, blogCredentials.image.name);
      formData.append("tags", JSON.stringify(blogCredentials.tags));
      
      console.log('Form submitted:', formData);
      console.log(blogCredentials);
      
      // Reset form
      this.blogForm.reset();
      this.tags = [];
      this.previewUrl = null;
      this.isSubmitting = false;
  }
}
