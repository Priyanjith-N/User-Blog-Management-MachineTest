import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-blog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-blog-form.component.html',
  styleUrl: './create-blog-form.component.css'
})
export class CreateBlogFormComponent {
  blogForm: FormGroup;
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

  constructor(private fb: FormBuilder) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(50)]],
      image: [null]
    });
  }

  ngOnInit(): void {}

  isFieldInvalid(fieldName: string): boolean {
    const field = this.blogForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
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
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
        this.blogForm.patchValue({ image: file });
      };
      reader.readAsDataURL(file);
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

  async onSubmit(): Promise<void> {
    if (this.blogForm.valid) {
      this.isSubmitting = true;
      
      // Simulate API call
      try {
        const formData = {
          ...this.blogForm.value,
          tags: this.tags
        };
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Form submitted:', formData);
        
        // Reset form
        this.blogForm.reset();
        this.tags = [];
        this.previewUrl = null;
        this.isSubmitting = false;
        
        // Show success message (you can implement your own notification system)
        alert('Blog post created successfully!');
      } catch (error) {
        console.error('Error submitting form:', error);
        this.isSubmitting = false;
        alert('An error occurred while creating the blog post.');
      }
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.blogForm.controls).forEach(key => {
        const control = this.blogForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
